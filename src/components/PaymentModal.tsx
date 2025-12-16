import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet, Lock, Copy, Check } from 'lucide-react';
import { api } from '../api/client';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw' | 'unlock';
  amount?: number;
  onSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, type, amount, onSuccess }) => {
  const [inputAmount, setInputAmount] = useState(amount || 10000);
  const [walletNumber, setWalletNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getUserInfo().then(data => {
        if (data && data.encrypted_yw_id) {
           setUser(data);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (type === 'deposit') {
        const res = await api.post('/api/payment/deposit', { amount: inputAmount });
        if (res && res.success) {
          alert('Đã gửi yêu cầu nạp tiền! Vui lòng chờ Admin duyệt (thường trong 5-10 phút).');
          onClose();
        }
      } else if (type === 'withdraw') {
        const res = await api.post('/api/payment/withdraw', { amount: inputAmount, wallet_number: walletNumber });
        if (res && res.success) {
          alert('Yêu cầu rút tiền đã được gửi!');
          onClose();
        } else {
          alert(res.error || 'Lỗi');
        }
      } else if (type === 'unlock') {
        // Unlock logic handled in parent usually, but can be here
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const transferContent = `NAP ${user?.encrypted_yw_id?.substring(0, 8) || 'USER'}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {type === 'deposit' && <><CreditCard className="text-green-600" /> Nạp Xu (MOMO)</>}
          {type === 'withdraw' && <><Wallet className="text-orange-600" /> Rút Tiền</>}
          {type === 'unlock' && <><Lock className="text-indigo-600" /> Mở Khóa Chương</>}
        </h2>

        <div className="space-y-4">
          {type === 'deposit' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <img src="/momo-qr.jpeg" alt="MOMO QR" className="w-48 h-48 object-contain border-2 border-pink-500 rounded-xl" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                    Quét mã để nạp
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Nhập số tiền muốn nạp (1 Xu = 1 VND):</p>
                <input 
                  type="number" 
                  value={inputAmount}
                  onChange={(e) => setInputAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-200">
                <p className="font-bold mb-2 text-gray-800">Thông tin chuyển khoản bắt buộc:</p>
                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 mb-2">
                  <span className="text-gray-500">Nội dung:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600">{transferContent}</span>
                    <button onClick={() => handleCopy(transferContent)} className="text-gray-400 hover:text-indigo-600">
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-red-500">* Vui lòng nhập đúng nội dung để được cộng Xu nhanh nhất.</p>
              </div>
            </>
          )}

          {type === 'withdraw' && (
            <>
              <p className="text-sm text-gray-600">Số tiền rút:</p>
              <input 
                type="number" 
                value={inputAmount}
                onChange={(e) => setInputAmount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <p className="text-sm text-gray-600">Số ví MOMO nhận tiền:</p>
              <input 
                type="text" 
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="09xx..."
              />
            </>
          )}

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            {loading ? 'Đang xử lý...' : (type === 'deposit' ? 'Tôi Đã Chuyển Tiền' : 'Xác Nhận')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
