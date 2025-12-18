import React from 'react';

// Thêm chữ export ngay trước function
export function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-10 bg-white rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          THÀNH CÔNG RỒI!
        </h1>
        <p className="text-gray-600">
          Cuối cùng cũng chạy được.
        </p>
      </div>
    </div>
  );
}
