
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Encrypted-Yw-ID, X-Is-Login',
      'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    const userId = request.headers.get('X-Encrypted-Yw-ID');
    const isLogin = request.headers.get('X-Is-Login') === '1';

    async function syncUser(request) {
      if (!userId) return;
      try {
        const existing = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
        if (!existing) {
           await env.DB.prepare('INSERT INTO users (encrypted_yw_id, role, balance, earnings) VALUES (?, ?, 0, 0)')
             .bind(userId, 'reader').run();
        }
      } catch (e) {
        console.error('Sync user error', e);
      }
    }

    function safeParseGenres(genres) {
      if (!genres) return [];
      if (typeof genres !== 'string') return genres;
      try {
        return JSON.parse(genres);
      } catch (e) {
        console.error('Failed to parse genres:', genres, e);
        return [];
      }
    }

    if (url.pathname === '/api/stories' && method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM stories ORDER BY views DESC').all();
      const parsedResults = results.map((story) => ({
        ...story,
        genres: safeParseGenres(story.genres)
      }));
      return new Response(JSON.stringify(parsedResults), { headers });
    }

    if (url.pathname.match(/^\/api\/stories\/\d+$/) && method === 'GET') {
      const id = url.pathname.split('/').pop();
      await env.DB.prepare('UPDATE stories SET views = views + 1 WHERE id = ?').bind(id).run();
      const story = await env.DB.prepare('SELECT * FROM stories WHERE id = ?').bind(id).first();
      if (!story) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
      
      const { results: chapters } = await env.DB.prepare('SELECT id, title, chapter_order, is_locked, price FROM chapters WHERE story_id = ? ORDER BY chapter_order ASC').bind(id).all();
      
      return new Response(JSON.stringify({ 
        ...story, 
        genres: safeParseGenres(story.genres),
        chapters 
      }), { headers });
    }

    if (url.pathname.match(/^\/api\/chapters\/\d+$/) && method === 'GET') {
      const id = url.pathname.split('/').pop();
      const chapter = await env.DB.prepare('SELECT * FROM chapters WHERE id = ?').bind(id).first();
      if (!chapter) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });

      if (chapter.is_locked === 1) {
        if (!isLogin) return new Response(JSON.stringify({ error: 'Locked', is_locked: true }), { status: 403, headers });
        const unlocked = await env.DB.prepare('SELECT * FROM unlocked_chapters WHERE user_id = (SELECT id FROM users WHERE encrypted_yw_id = ?) AND chapter_id = ?').bind(userId, id).first();
        if (!unlocked) {
          const story = await env.DB.prepare('SELECT author_id FROM stories WHERE id = ?').bind(chapter.story_id).first();
          const user = await env.DB.prepare('SELECT id FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
          if (story && user && story.author_id === user.id) {
            // Author can read their own story
          } else {
             return new Response(JSON.stringify({ error: 'Locked', is_locked: true, price: chapter.price }), { status: 403, headers });
          }
        }
      }
      return new Response(JSON.stringify(chapter), { headers });
    }

    if (url.pathname === '/api/chapters/unlock' && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      await syncUser(request);
      
      const { chapter_id } = await request.json();
      const chapter = await env.DB.prepare('SELECT * FROM chapters WHERE id = ?').bind(chapter_id).first();
      const user = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      const story = await env.DB.prepare('SELECT author_id FROM stories WHERE id = ?').bind(chapter.story_id).first();

      if (!chapter || !user || !story) return new Response(JSON.stringify({ error: 'Error' }), { status: 400, headers });

      if (user.balance < chapter.price) {
        return new Response(JSON.stringify({ error: 'Insufficient balance' }), { status: 400, headers });
      }

      await env.DB.batch([
        env.DB.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(chapter.price, user.id),
        env.DB.prepare('UPDATE users SET earnings = earnings + ? WHERE id = ?').bind(chapter.price, story.author_id),
        env.DB.prepare('INSERT INTO unlocked_chapters (user_id, chapter_id) VALUES (?, ?)').bind(user.id, chapter_id),
        env.DB.prepare('INSERT INTO transactions (user_id, amount, type, reference_id, status, description) VALUES (?, ?, ?, ?, ?, ?)').bind(user.id, -chapter.price, 'unlock_chapter', chapter_id, 'completed', `Unlock ${chapter.title}`),
        env.DB.prepare('INSERT INTO transactions (user_id, amount, type, reference_id, status, description) VALUES (?, ?, ?, ?, ?, ?)').bind(story.author_id, chapter.price, 'earning', chapter_id, 'completed', `Revenue from ${chapter.title}`)
      ]);

      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname === '/api/favorites' && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      await syncUser(request);
      const { story_id } = await request.json();
      try {
        await env.DB.prepare('INSERT INTO favorites (user_id, story_id) VALUES ((SELECT id FROM users WHERE encrypted_yw_id = ?), ?)').bind(userId, story_id).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      } catch (e) {
        return new Response(JSON.stringify({ success: true, message: 'Already favorited' }), { headers });
      }
    }

    if (url.pathname === '/api/favorites' && method === 'DELETE') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      const { story_id } = await request.json();
      await env.DB.prepare('DELETE FROM favorites WHERE user_id = (SELECT id FROM users WHERE encrypted_yw_id = ?) AND story_id = ?').bind(userId, story_id).run();
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname === '/api/payment/deposit' && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      await syncUser(request);
      const { amount } = await request.json();
      
      await env.DB.prepare('INSERT INTO transactions (user_id, amount, type, status, description) VALUES ((SELECT id FROM users WHERE encrypted_yw_id = ?), ?, ?, ?, ?)')
        .bind(userId, amount, 'deposit', 'pending', 'MOMO Deposit Request').run();
        
      return new Response(JSON.stringify({ success: true, message: 'Request created. Please transfer money.' }), { headers });
    }

    if (url.pathname === '/api/payment/withdraw' && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      await syncUser(request);
      const { amount, wallet_number } = await request.json();
      const user = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      
      if (user.earnings < amount) return new Response(JSON.stringify({ error: 'Insufficient earnings' }), { status: 400, headers });

      await env.DB.batch([
        env.DB.prepare('UPDATE users SET earnings = earnings - ? WHERE id = ?').bind(amount, user.id),
        env.DB.prepare('INSERT INTO transactions (user_id, amount, type, reference_id, status, description) VALUES (?, ?, ?, ?, ?, ?)').bind(user.id, -amount, 'withdraw', wallet_number, 'pending', 'Withdraw Request')
      ]);

      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname.match(/^\/api\/admin\/deposits\/\d+\/approve$/) && method === 'POST') {
      const id = url.pathname.split('/')[4];
      const tx = await env.DB.prepare('SELECT * FROM transactions WHERE id = ?').bind(id).first();
      if (!tx || tx.status !== 'pending' || tx.type !== 'deposit') return new Response(JSON.stringify({ error: 'Invalid tx' }), { status: 400, headers });

      await env.DB.batch([
        env.DB.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').bind(tx.amount, tx.user_id),
        env.DB.prepare('UPDATE transactions SET status = ? WHERE id = ?').bind('completed', id)
      ]);
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname === '/api/admin/transactions' && method === 'GET') {
      const { results } = await env.DB.prepare(`
        SELECT t.*, u.display_name
        FROM transactions t 
        JOIN users u ON t.user_id = u.id 
        ORDER BY t.created_at DESC
      `).all();
      return new Response(JSON.stringify(results), { headers });
    }

    if (url.pathname === '/api/my-stories' && method === 'GET') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      const { results } = await env.DB.prepare(`
        SELECT * FROM stories 
        WHERE author_id = (SELECT id FROM users WHERE encrypted_yw_id = ?)
      `).bind(userId).all();
      const parsedResults = results.map((story) => ({
        ...story,
        genres: safeParseGenres(story.genres)
      }));
      return new Response(JSON.stringify(parsedResults), { headers });
    }

    if (url.pathname === '/api/my-stories' && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      const { title, description, genres, cover } = await request.json();
      await env.DB.prepare('INSERT INTO stories (title, author_id, description, genres, cover) VALUES (?, (SELECT id FROM users WHERE encrypted_yw_id = ?), ?, ?, ?)')
        .bind(title, userId, description, JSON.stringify(genres), cover).run();
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname.match(/^\/api\/my-stories\/\d+\/chapters$/) && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      const storyId = url.pathname.split('/')[3];
      const { title, content, price, is_locked } = await request.json();
      
      const story = await env.DB.prepare('SELECT author_id FROM stories WHERE id = ?').bind(storyId).first();
      const user = await env.DB.prepare('SELECT id FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      if (!story || story.author_id !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

      const maxOrder = await env.DB.prepare('SELECT MAX(chapter_order) as max_order FROM chapters WHERE story_id = ?').bind(storyId).first();
      const nextOrder = (maxOrder?.max_order || 0) + 1;

      await env.DB.prepare('INSERT INTO chapters (story_id, title, content, chapter_order, is_locked, price) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(storyId, title, content, nextOrder, is_locked ? 1 : 0, price || 0).run();
      
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname.match(/^\/api\/stories\/\d+\/comments$/) && method === 'GET') {
      const storyId = url.pathname.split('/')[3];
      const { results } = await env.DB.prepare(`
        SELECT c.*, u.display_name, u.photo_url 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.story_id = ? 
        ORDER BY c.created_at DESC
      `).bind(storyId).all();
      return new Response(JSON.stringify(results), { headers });
    }

    if (url.pathname.match(/^\/api\/stories\/\d+\/comments$/) && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      const storyId = url.pathname.split('/')[3];
      const { content } = await request.json();
      await env.DB.prepare('INSERT INTO comments (user_id, story_id, content) VALUES ((SELECT id FROM users WHERE encrypted_yw_id = ?), ?, ?)')
        .bind(userId, storyId, content).run();
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname === '/api/user/me' && method === 'GET') {
      if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      let user = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      
      if (!user) {
        // Auto-create user if not exists (robustness)
        await env.DB.prepare('INSERT INTO users (encrypted_yw_id, role, balance, earnings) VALUES (?, ?, 0, 0)')
             .bind(userId, 'reader').run();
        user = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      }
      
      return new Response(JSON.stringify(user || { encrypted_yw_id: userId, balance: 0, earnings: 0, role: 'reader' }), { headers });
    }

    if (url.pathname === '/api/sync-user' && method === 'POST') {
      if (!userId) return new Response(JSON.stringify({ error: 'No User ID' }), { status: 400, headers });
      const body = await request.json();
      const existing = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      if (existing) {
        await env.DB.prepare('UPDATE users SET display_name = ?, photo_url = ?, email = ? WHERE encrypted_yw_id = ?')
          .bind(body.display_name, body.photo_url, body.email || null, userId).run();
      } else {
        await env.DB.prepare('INSERT INTO users (encrypted_yw_id, display_name, photo_url, email, role, balance, earnings) VALUES (?, ?, ?, ?, ?, 0, 0)')
          .bind(userId, body.display_name, body.photo_url, body.email || null, 'reader').run();
      }
      const user = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?').bind(userId).first();
      return new Response(JSON.stringify(user || { success: true }), { headers });
    }

    if (url.pathname === '/api/author-request' && method === 'POST') {
      if (!isLogin) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      const { reason } = await request.json();
      await env.DB.prepare('INSERT INTO author_requests (user_id, reason) VALUES ((SELECT id FROM users WHERE encrypted_yw_id = ?), ?)')
        .bind(userId, reason).run();
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (url.pathname === '/api/admin/requests' && method === 'GET') {
      const { results } = await env.DB.prepare(`
        SELECT r.*, u.display_name 
        FROM author_requests r 
        JOIN users u ON r.user_id = u.id 
        WHERE r.status = 'pending'
      `).all();
      return new Response(JSON.stringify(results), { headers });
    }

    return new Response('Not Found', { status: 404, headers });
  }
};
