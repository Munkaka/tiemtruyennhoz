
import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Plus, Book, Edit, List } from 'lucide-react';

const AuthorDashboard: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', description: '', genres: '', cover: '' });
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [newChapter, setNewChapter] = useState({ title: '', content: '', price: 0, is_locked: false });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    api.get('/api/my-stories').then(data => {
      if (Array.isArray(data)) setStories(data);
    });
  };

  const handleCreateStory = async () => {
    const res = await api.post('/api/my-stories', {
      ...newStory,
      genres: newStory.genres.split(',').map(g => g.trim())
    });
    if (res && res.success) {
      alert('Tạo truyện thành công!');
      setShowCreate(false);
      loadStories();
    }
  };

  const handleAddChapter = async () => {
    if (!selectedStory) return;
    const res = await api.post(`/api/my-stories/${selectedStory.id}/chapters`, newChapter);
    if (res && res.success) {
      alert('Thêm chương thành công!');
      setSelectedStory(null);
      setNewChapter({ title: '', content: '', price: 0, is_locked: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Truyện</h1>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={18} /> Thêm Truyện Mới
        </button>
      </div>

      {showCreate && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-indigo-100">
          <h2 className="font-bold mb-4">Thông tin truyện mới</h2>
          <div className="space-y-4">
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Tên truyện" 
              value={newStory.title}
              onChange={e => setNewStory({...newStory, title: e.target.value})}
            />
            <textarea 
              className="w-full border p-2 rounded" 
              placeholder="Mô tả" 
              value={newStory.description}
              onChange={e => setNewStory({...newStory, description: e.target.value})}
            />
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Thể loại (cách nhau bởi dấu phẩy)" 
              value={newStory.genres}
              onChange={e => setNewStory({...newStory, genres: e.target.value})}
            />
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Link ảnh bìa" 
              value={newStory.cover}
              onChange={e => setNewStory({...newStory, cover: e.target.value})}
            />
            <div className="flex gap-2">
              <button onClick={handleCreateStory} className="bg-green-600 text-white px-4 py-2 rounded">Lưu</button>
              <button onClick={() => setShowCreate(false)} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {selectedStory ? (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-xl">Thêm chương cho: {selectedStory.title}</h2>
            <button onClick={() => setSelectedStory(null)} className="text-gray-500">Đóng</button>
          </div>
          <div className="space-y-4">
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Tên chương" 
              value={newChapter.title}
              onChange={e => setNewChapter({...newChapter, title: e.target.value})}
            />
            <textarea 
              className="w-full border p-2 rounded h-40" 
              placeholder="Nội dung chương" 
              value={newChapter.content}
              onChange={e => setNewChapter({...newChapter, content: e.target.value})}
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={newChapter.is_locked}
                  onChange={e => setNewChapter({...newChapter, is_locked: e.target.checked})}
                />
                Khóa chương (VIP)
              </label>
              {newChapter.is_locked && (
                <input 
                  type="number" 
                  className="border p-1 rounded w-24" 
                  placeholder="Giá Xu"
                  value={newChapter.price}
                  onChange={e => setNewChapter({...newChapter, price: Number(e.target.value)})}
                />
              )}
            </div>
            <button onClick={handleAddChapter} className="bg-indigo-600 text-white px-4 py-2 rounded">Đăng Chương</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {stories.map(story => (
            <div key={story.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
              <div className="flex gap-4">
                <img src={story.cover} className="w-16 h-24 object-cover rounded" />
                <div>
                  <h3 className="font-bold text-lg">{story.title}</h3>
                  <p className="text-sm text-gray-500">{story.views} lượt xem</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{story.status}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStory(story)}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-2"
              >
                <Plus size={16} /> Thêm Chương
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
