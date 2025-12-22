import React from 'react';
import { Eye, Star } from 'lucide-react';
import { Story } from '../data/mockData';
import { Link } from 'react-router-dom';

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  // Helper to safely get genres array
  const getGenres = (g: any): string[] => {
    if (Array.isArray(g)) return g;
    if (typeof g === 'string') {
      try {
        const parsed = JSON.parse(g);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const genres = getGenres(story.genres);
  const authorName = story.author || 'Tác giả';

  return (
    <Link to={`/story/${story.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-blue-100">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={story.cover || 'https://via.placeholder.com/300x450'} 
          alt={story.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span>{story.rating || 0}</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
           <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg">
             Đọc Ngay
           </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1 mb-2">
          {genres.slice(0, 2).map((genre) => (
            <span key={genre} className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              {genre}
            </span>
          ))}
        </div>
        
        <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors" title={story.title}>
          {story.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
          {authorName}
        </p>
        
        <div className="mt-auto flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{(story.views || 0).toLocaleString()}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full ${story.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            {story.status === 'Completed' ? 'Full' : 'Đang ra'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
