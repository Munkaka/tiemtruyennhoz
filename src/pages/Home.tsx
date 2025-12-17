import React, { useEffect, useState } from 'react';
import { MOCK_STORIES } from '../data/mockData';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles } from 'lucide-react';
import { api } from '../api/client';

const Home: React.FC = () => {
  // Sử dụng dữ liệu mẫu, KHÔNG gọi API nữa để test
  const [stories, setStories] = useState(MOCK_STORIES);

  /* 
  useEffect(() => {
    api.get('/api/stories').then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setStories(data);
      }
    });
  }, []);
  */

  return (
    <div className="space-y-10">
      {/* Banner */}
      <section className="relative h-64 md:h-80 rounded-2xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80" 
          alt="Banner" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Tiệm Truyện Nhỏ</h1>
          <p className="text-gray-200 text-lg max-w-xl">Thế giới tiên hiệp, huyền huyễn đặc sắc đang chờ bạn khám phá.</p>
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-red-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Truyện Đề Cử</h2>
          </div>
          <button className="text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors">
            Xem tất cả
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* New Updates Section */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Mới Cập Nhật</h2>
          </div>
          <button className="text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors">
            Xem tất cả
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {[...stories].reverse().map((story) => (
            <StoryCard key={`new-${story.id}`} story={story} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
