import React, { useState } from 'react';
import { X, Mail, Lock, User, Chrome } from 'lucide-react';
import { api } from '../api/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Login/Register logic for this template
    // In a real app, you would call api.post('/auth/login', ...)
    
    setTimeout(() => {
      // Mock successful login by setting localStorage
      // The backend uses X-Encrypted-Yw-ID header to identify users
      const mockUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      
      localStorage.setItem('yw_user_id', mockUserId);
      localStorage.setItem('yw_is_login', '1');
      
      // Sync user info to backend immediately
      api.post('/api/sync-user', {
        display_name: formData.displayName || formData.email.split('@')[0],
        photo_url: `https://ui-avatars.com/api/?name=${formData.displayName || 'User'}&background=random`
      }).then(() => {
        setLoading(false);
        window.location.reload(); // Reload to update UI state
      });
    }, 1000);
  };

  const handleGoogleLogin = () => {
    // Mock Google Login
    setLoading(true);
    setTimeout(() => {
      const mockUserId = 'google_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('yw_user_id', mockUserId);
      localStorage.setItem('yw_is_login', '1');
      
      api.post('/api/sync-user', {
        display_name: 'Google User',
        photo_url: 'https://ui-avatars.com/api/?name=Google+User&background=random'
      }).then(() => {
        setLoading(false);
        window.location.reload();
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
          </h2>
          <p className="text-gray-500 mb-6">
            {isRegister ? 'Tạo tài khoản để đọc và viết truyện' : 'Chào mừng bạn quay trở lại!'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tên hiển thị</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Nhập tên hiển thị"
                    value={formData.displayName}
                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng Ký' : 'Đăng Nhập')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-colors"
              >
                <Chrome size={20} className="text-red-500" />
                <span>Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">
              {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 font-bold text-indigo-600 hover:text-indigo-500"
            >
              {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
            </button>
          </div>
          
          {/* Admin Login Hint */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-400 mb-2">Chế độ kiểm thử (Testing Mode):</p>
             <button 
               onClick={() => {
                 // Mock Admin Login
                 setLoading(true);
                 setTimeout(() => {
                   const mockUserId = 'admin_' + Math.random().toString(36).substr(2, 9);
                   localStorage.setItem('yw_user_id', mockUserId);
                   localStorage.setItem('yw_is_login', '1');
                   
                   // Sync user as admin
                   api.post('/api/sync-user', {
                     display_name: 'Admin User',
                     photo_url: 'https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff'
                   }).then(() => {
                     setLoading(false);
                     alert('Đăng nhập thành công! Bạn đang sử dụng tài khoản Admin giả lập.');
                     window.location.reload();
                   });
                 }, 1000);
               }}
               className="text-xs text-indigo-400 hover:text-indigo-600 underline"
             >
               Đăng nhập nhanh (Admin)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
