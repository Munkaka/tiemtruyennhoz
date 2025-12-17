import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 border-2 border-green-500 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          TEST THÀNH CÔNG!
        </h1>
        <p className="text-gray-600 text-lg">
          Nếu bạn thấy dòng này, nghĩa là: <br/>
          1. Web vẫn chạy tốt (Layout, App ổn). <br/>
          2. Lỗi nằm ở file <strong>StoryCard.tsx</strong> hoặc dữ liệu.
        </p>
      </div>
    </div>
  );
};

export default Home;
