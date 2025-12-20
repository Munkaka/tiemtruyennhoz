import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MOCK_STORIES, Story } from '../data/mockData';
import StoryCard from '../components/StoryCard';
import { TrendingUp, Clock, Star } from 'lucide-react';

const Home: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'top'>('trending');

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/stories');
      if (data && Array.isArray(data) && data.length > 0) {
        setStories(data);
      } else {
        setStories(MOCK_STORIES);
      }
    } catch (error) {
      setStories(MOCK_STORIES);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'trending', label: 'Xu hướng', icon: TrendingUp },
    { id: 'latest', label: 'Mới nhất', icon: Clock },
    { id: 'top', label: 'Đánh giá cao', icon: Star }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Tiệm Truyện Nhỏ</h1>
        <p className="text-blue-100 text-lg">Khám phá hàng ngàn truyện hay đang chờ bạn</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
              <div className="aspect-[2/3] bg-gray-200 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}

      {!loading && stories.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-500">Không tìm thấy truyện nào</p>
        </div>
      )}
    </div>
  );
};

export default Home;
