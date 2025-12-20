import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { api } from '../api/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && window.google) {
      initializeGoogleSignIn();
    }
  }, [isOpen]);

  const initializeGoogleSignIn = () => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in .env file');
      return;
    }

    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
      auto_select: false,
    });

    if (googleButtonRef.current) {
      window.google?.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          locale: 'vi'
        }
      );
    }
  };

  const handleGoogleCallback = async (response: any) => {
    setLoading(true);
    try {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));

      const userId = 'google_' + payload.sub;

      localStorage.setItem('yw_user_id', userId);
      localStorage.setItem('yw_is_login', '1');

      await api.post('/api/sync-user', {
        display_name: payload.name || payload.email.split('@')[0],
        photo_url: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name || 'User')}&background=random`,
        email: payload.email
      });

      window.location.reload();
    } catch (error) {
      console.error('Google login error:', error);
      alert('Đăng nhập thất bại. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const mockUserId = 'user_' + Math.random().toString(36).substr(2, 9);

      localStorage.setItem('yw_user_id', mockUserId);
      localStorage.setItem('yw_is_login', '1');

      api.post('/api/sync-user', {
        display_name: formData.displayName || formData.email.split('@')[0],
        photo_url: `https://ui-avatars.com/api/?name=${formData.displayName || 'User'}&background=random`,
        email: formData.email
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

          <div className="mb-6">
            <div ref={googleButtonRef} className="w-full flex justify-center" />
            {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-yellow-700">
                  Cần cấu hình Google Client ID để sử dụng đăng nhập Google.
                </p>
              </div>
            )}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tên hiển thị</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng Ký' : 'Đăng Nhập')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">
              {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 font-bold text-blue-600 hover:text-blue-500"
            >
              {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
