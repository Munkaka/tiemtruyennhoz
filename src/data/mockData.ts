
export interface Story {
  id: string;
  title: string;
  author: string;
  cover: string;
  genres: string[];
  views: number;
  rating: number;
  status: 'Ongoing' | 'Completed';
  description: string;
}

export const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: 'Thiên Đạo Đồ Thư Quán',
    author: 'Hoành Tảo Thiên Nhai',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80',
    genres: ['Huyền Huyễn', 'Tiên Hiệp'],
    views: 150000,
    rating: 4.8,
    status: 'Completed',
    description: 'Trương Huyền xuyên việt qua dị giới, trở thành một gã lão sư quang vinh. Trong đầu có một cái thần bí thư viện...'
  },
  {
    id: '2',
    title: 'Toàn Chức Pháp Sư',
    author: 'Loạn',
    cover: 'https://images.unsplash.com/photo-1515524738708-327f6b0033a7?w=500&q=80',
    genres: ['Pháp Thuật', 'Đô Thị'],
    views: 230000,
    rating: 4.9,
    status: 'Ongoing',
    description: 'Tỉnh lại sau giấc ngủ, thế giới đại biến. Quen thuộc cao trung truyền thụ chính là ma pháp...'
  },
  {
    id: '3',
    title: 'Đấu Phá Thương Khung',
    author: 'Thiên Tàm Thổ Đậu',
    cover: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=500&q=80',
    genres: ['Huyền Huyễn', 'Dị Giới'],
    views: 500000,
    rating: 5.0,
    status: 'Completed',
    description: 'Nơi này là thuộc về đấu khí thế giới, không có hoa tiếu diễm lệ ma pháp, có, vẻn vẹn sinh sôi đến đỉnh cao đấu khí!'
  },
  {
    id: '4',
    title: 'Phàm Nhân Tu Tiên',
    author: 'Vong Ngữ',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80',
    genres: ['Tiên Hiệp', 'Kiếm Hiệp'],
    views: 340000,
    rating: 4.7,
    status: 'Completed',
    description: 'Một cái bình thường sơn thôn tiểu tử, ngẫu nhiên phía dưới tiến vào đến địa phương giang hồ tiểu môn phái...'
  },
  {
    id: '5',
    title: 'Thế Giới Hoàn Mỹ',
    author: 'Thần Đông',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80',
    genres: ['Huyền Huyễn', 'Tiên Hiệp'],
    views: 410000,
    rating: 4.9,
    status: 'Completed',
    description: 'Một hạt bụi có thể lấp biển, một cọng cỏ chém hết mặt trời mặt trăng và ngôi sao...'
  }
];
