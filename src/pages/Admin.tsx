
import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Check, X, Shield, DollarSign, Users } from 'lucide-react';

import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'authors' | 'finance'>('finance');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    api.get('/api/admin/requests').then(data => {
      if (Array.isArray(data)) setRequests(data);
    });
    api.get('/api/admin/transactions').then(data => {
      if (Array.isArray(data)) setTransactions(data);
    });
  };

  const handleApproveDeposit = async (id: number) => {
    if (confirm('Xác nhận đã nhận tiền và cộng Xu cho người dùng?')) {
      const res = await api.post(`/api/admin/deposits/${id}/approve`, {});
      if (res && res.success) {
        alert('Đã duyệt nạp tiền!');
        loadData();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản Trị Viên</h1>
            <p className="text-gray-500">Hệ thống quản lý toàn diện</p>
          </div>
        </div>
        <Link to="/author" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
          Đăng Truyện Mới
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('finance')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'finance' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Tài Chính & Giao Dịch
        </button>
        <button 
          onClick={() => setActiveTab('authors')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'authors' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          Yêu Cầu Tác Giả
        </button>
      </div>

      {activeTab === 'finance' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg flex items-center gap-2"><DollarSign size={20} /> Quản lý Nạp/Rút</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Loại</th>
                  <th className="px-6 py-4">Số tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-xs text-gray-500">#{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{tx.display_name}</div>
                      <div className="text-xs text-gray-500">{tx.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        tx.type === 'deposit' ? 'bg-green-100 text-green-700' : 
                        tx.type === 'withdraw' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-600' : 
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.description}</td>
                    <td className="px-6 py-4 text-right">
                      {tx.status === 'pending' && tx.type === 'deposit' && (
                        <button 
                          onClick={() => handleApproveDeposit(tx.id)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-indigo-700"
                        >
                          Duyệt Nạp
                        </button>
                      )}
                      {tx.status === 'pending' && tx.type === 'withdraw' && (
                        <button 
                          className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600"
                          onClick={() => alert('Vui lòng chuyển khoản thủ công cho user, sau đó cập nhật DB (Tính năng cập nhật trạng thái rút tiền đang phát triển)')}
                        >
                          Xử lý Rút
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'authors' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
           {/* Existing Author Request Table */}
           <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg flex items-center gap-2"><Users size={20} /> Yêu cầu Tác giả</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Lý do</th>
                <th className="px-6 py-4">Ngày gửi</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{req.display_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(req.created_at * 1000).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:underline text-sm font-medium">Duyệt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
