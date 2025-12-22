
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Library, 
  History, 
  List, 
  LogIn, 
  Search, 
  Bell, 
  Menu, 
  X, 
  BookOpen,
  User
} from 'lucide-react';
import { api } from '../api/client';
import LoginModal from './LoginModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    api.getUserInfo().then(data => {
      if (data && data.encrypted_yw_id) {
        setUser(data);
        // Sync user to backend
        api.post('/api/sync-user', { 
          display_name: data.display_name || 'User', 
          photo_url: data.photo_url 
        });
      }
    });
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { icon: Library, label: 'Thư Viện', path: '/library' },
    { icon: History, label: 'Lịch Sử Đọc', path: '/history' },
    { icon: List, label: 'Thể Loại', path: '/genres' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="text-blue-600" size={32} />
              <span className="text-xl font-bold text-gray-800 hidden sm:block">Tiệm Truyện Nhỏ</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              {isSearchOpen && (
                <input 
                  type="text" 
                  placeholder="Tìm truyện..." 
                  className="absolute right-10 top-1/2 -translate-y-1/2 w-48 sm:w-64 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg"
                  autoFocus
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                />
              )}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full relative group transition-colors ${isSearchOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Search size={20} />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full relative group transition-colors ${isNotificationsOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 font-bold text-gray-700">Thông báo</div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                      <p className="text-sm text-gray-800 font-medium">Chào mừng bạn đến với TiệmTruyệnNhỏ!</p>
                      <p className="text-xs text-gray-500 mt-1">Vừa xong</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-800">Hệ thống đang bảo trì tính năng nạp tiền.</p>
                      <p className="text-xs text-gray-500 mt-1">1 giờ trước</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-bold text-gray-700">{user.display_name || 'User'}</span>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    {user.balance?.toLocaleString() || 0} Xu
                  </span>
                </div>
                <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                    {user.photo_url ? <img src={user.photo_url} alt="Avatar" className="w-full h-full object-cover" /> : <User className="p-1 text-blue-600" />}
                  </div>
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden md:flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <div className="flex flex-1 container mx-auto px-4 py-6 gap-6 relative">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col p-4">
            <div className="flex justify-between items-center lg:hidden mb-6">
              <span className="text-xl font-bold text-gray-800">Menu</span>
              <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="my-4 border-t border-gray-200 lg:hidden"></div>

              {!user && (
                <button
                  onClick={() => { setIsSidebarOpen(false); setIsLoginModalOpen(true); }}
                  className="flex lg:hidden items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full"
                >
                  <LogIn size={20} />
                  <span className="font-medium">Đăng nhập / Đăng ký</span>
                </button>
              )}
            </nav>

            {/* Author Promotion Card */}
            <div className="mt-auto pt-6 hidden lg:block">
               <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl p-4 text-white shadow-md">
                  <h3 className="font-bold text-sm mb-1">Trở thành Tác giả?</h3>
                  <p className="text-xs opacity-90 mb-3">Đăng tải truyện và kiếm thu nhập.</p>
                  <Link to="/profile" className="block text-center w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-xs font-bold transition-colors">
                    Gửi yêu cầu
                  </Link>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
