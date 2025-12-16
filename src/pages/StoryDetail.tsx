
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Eye, MessageCircle, Lock, BookOpen, Unlock } from 'lucide-react';
import { api } from '../api/client';
import { MOCK_STORIES } from '../data/mockData';
import PaymentModal from '../components/PaymentModal';

const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]);
  const [readingChapter, setReadingChapter] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'deposit' | 'unlock'>('deposit');
  const [unlockChapterId, setUnlockChapterId] = useState<number | null>(null);
  const [unlockPrice, setUnlockPrice] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadStory();
    loadComments();
    // Auto favorite after 30 seconds
    timerRef.current = setTimeout(() => {
      handleFavorite(true);
    }, 30000);
    return () => clearTimeout(timerRef.current);
  }, [id]);

  const loadComments = () => {
    api.get(`/api/stories/${id}/comments`).then(data => {
      if (Array.isArray(data)) setComments(data);
    });
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/api/stories/${id}/comments`, { content: commentText });
      if (res && res.success) {
        setCommentText('');
        loadComments();
        alert('Đã gửi bình luận!');
      } else {
        alert('Vui lòng đăng nhập để bình luận');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadStory = () => {
    api.get(`/api/stories/${id}`).then(data => {
      if (data && !data.error) {
        setStory(data);
        setChapters(data.chapters || []);
      } else {
        const mock = MOCK_STORIES.find(s => s.id === id);
        if (mock) {
            setStory(mock);
            setChapters([
                { id: 1, title: 'Chương 1: Mở đầu', is_locked: 0 },
                { id: 2, title: 'Chương 2: Diễn biến', is_locked: 0 },
                { id: 3, title: 'Chương 3: Cao trào (VIP)', is_locked: 1, price: 100 },
            ]);
        }
      }
    });
  };

  const handleFavorite = async (auto = false) => {
    if (isFavorited && auto) return;
    try {
      await api.post('/api/favorites', { story_id: id });
      setIsFavorited(true);
      if (!auto) alert('Đã thêm vào yêu thích!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleReadChapter = async (chapterId: number) => {
    const res = await api.get(`/api/chapters/${chapterId}`);
    if (res.error === 'Locked') {
      setUnlockChapterId(chapterId);
      setUnlockPrice(res.price || 100);
      // Check balance (mock check, real app would check user info)
      const user = await api.getUserInfo(); // Need to implement this properly in client
      // For now, just show unlock confirm
      if (confirm(`Chương này bị khóa. Bạn có muốn mở khóa với giá ${res.price || 100} Xu?`)) {
         handleUnlock(chapterId);
      }
    } else if (res.content) {
      setReadingChapter(res);
      window.scrollTo(0, 0);
    }
  };

  const handleUnlock = async (chapterId: number) => {
    const res = await api.post('/api/chapters/unlock', { chapter_id: chapterId });
    if (res && res.success) {
      alert('Mở khóa thành công!');
      handleReadChapter(chapterId);
    } else {
      if (res.error === 'Insufficient balance') {
        if (confirm('Số dư không đủ. Bạn có muốn nạp thêm Xu?')) {
          setPaymentType('deposit');
          setShowPayment(true);
        }
      } else {
        alert(res.error || 'Lỗi mở khóa');
      }
    }
  };

  if (!story) return <div className="p-10 text-center">Đang tải...</div>;

  if (readingChapter) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm min-h-screen">
        <button onClick={() => setReadingChapter(null)} className="mb-6 text-indigo-600 hover:underline">
          &larr; Quay lại trang truyện
        </button>
        <h1 className="text-2xl font-bold mb-6">{readingChapter.title}</h1>
        <div className="prose max-w-none leading-loose text-gray-800 whitespace-pre-wrap">
          {readingChapter.content}
        </div>
        <div className="mt-10 flex justify-between mb-10">
           <button className="px-4 py-2 border rounded hover:bg-gray-50">Chương trước</button>
           <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Chương sau</button>
        </div>

        {/* Comments in Reading Mode */}
        <div className="border-t pt-8">
          <h3 className="font-bold text-lg mb-4">Bình luận</h3>
          <div className="space-y-4 mb-6">
            <textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
              placeholder="Chia sẻ cảm nghĩ của bạn..."
            ></textarea>
            <div className="flex justify-end">
              <button onClick={handlePostComment} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Gửi</button>
            </div>
          </div>
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-bold text-sm text-indigo-600 mb-1">{c.display_name || 'Người dùng'}</div>
                <p className="text-gray-700">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        type={paymentType} 
      />

      {/* Info Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img src={story.cover} alt={story.title} className="w-full rounded-lg shadow-md aspect-[2/3] object-cover" />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{story.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1"><Eye size={16} /> {story.views?.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Heart size={16} /> {story.rating}</span>
            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{story.status}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {story.genres && (Array.isArray(story.genres) ? story.genres : JSON.parse(story.genres || '[]')).map((g: string) => (
              <span key={g} className="border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-600">{g}</span>
            ))}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-5">{story.description}</p>

          <div className="flex gap-3">
            <button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              <BookOpen size={20} /> Đọc Ngay
            </button>
            <button 
              onClick={() => handleFavorite(false)}
              className={`px-4 py-3 rounded-xl border transition-colors flex items-center justify-center ${isFavorited ? 'bg-pink-50 border-pink-200 text-pink-600' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <Heart size={20} className={isFavorited ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-600" /> Danh sách chương
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {chapters.map((chapter: any) => (
            <div 
              key={chapter.id} 
              onClick={() => handleReadChapter(chapter.id)}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors cursor-pointer group"
            >
              <span className="text-gray-700 font-medium group-hover:text-indigo-600 truncate">{chapter.title}</span>
              {chapter.is_locked === 1 && (
                <div className="flex items-center gap-1 text-xs text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded">
                  <Lock size={12} /> {chapter.price} Xu
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-indigo-600" /> Bình luận ({comments.length})
        </h2>
        <div className="space-y-4">
          <textarea 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
            placeholder="Để lại bình luận của bạn..."
          ></textarea>
          <div className="flex justify-end">
            <button onClick={handlePostComment} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Gửi</button>
          </div>
          
          <div className="mt-6 space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {c.display_name?.[0] || 'U'}
                  </div>
                  <span className="font-bold text-sm text-gray-800">{c.display_name || 'Người dùng'}</span>
                  <span className="text-xs text-gray-400">{new Date(c.created_at * 1000).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 pl-10">{c.content}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-gray-400 py-4">Chưa có bình luận nào.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
