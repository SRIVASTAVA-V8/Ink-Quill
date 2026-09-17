import { Book } from '../models/book.model';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';  
import{ CartItem ,Cart} from '../models/cart.model';
import { Wishlist, WishlistItem } from '../models/wishlist.model';

export const DUMMY_BOOKS: Book[] = [
  {
    _id: '6a906d68907cf1aef70c41e9',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library. When Nora Seed finds herself in the Midnight Library, she has a chance to make things right. Up until now, her life has been full of misery and regret. She feels she has let everyone down, including herself. But things are about to change.',
    ISBN: '9780525559474',
    price: 24.99,
    discount: 10,
    category: 'Fiction',
    tags: ['fiction', 'fantasy', 'philosophical'],
    stock: 150,
    language: 'English',
    publisher: 'Viking',
    publishedDate: new Date('2020-08-13'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.5,
    ratingCount: 1234,
    createdAt: new Date('2020-08-01'),
    updatedAt: new Date('2020-08-13')
  },
  {
    _id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    ISBN: '9780735211292',
    price: 19.99,
    discount: 20,
    category: 'Non-Fiction',
    tags: ['self-help', 'productivity', 'psychology'],
    stock: 200,
    language: 'English',
    publisher: 'Avery',
    publishedDate: new Date('2018-10-16'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.8,
    ratingCount: 5678,
    createdAt: new Date('2018-10-01'),
    updatedAt: new Date('2018-10-16')
  },
  {
    _id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    ISBN: '9780441013593',
    price: 18.99,
    discount: 0,
    category: 'Sci-Fi',
    tags: ['sci-fi', 'adventure', 'classic'],
    stock: 80,
    language: 'English',
    publisher: 'Ace',
    publishedDate: new Date('1965-08-01'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.7,
    ratingCount: 3456,
    createdAt: new Date('1965-07-01'),
    updatedAt: new Date('1965-08-01')
  },
  {
    _id: '4',
    title: 'Becoming',
    author: 'Michelle Obama',
    description: 'In her memoir, a work of deep reflection and mesmerizing storytelling, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her - from her childhood on the South Side of Chicago to her years as an executive balancing the demands of motherhood and work.',
    ISBN: '9781524763138',
    price: 32.99,
    discount: 15,
    category: 'Biography',
    tags: ['memoir', 'inspirational', 'politics'],
    stock: 120,
    language: 'English',
    publisher: 'Crown',
    publishedDate: new Date('2018-11-13'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.9,
    ratingCount: 8901,
    createdAt: new Date('2018-11-01'),
    updatedAt: new Date('2018-11-13')
  },
  {
    _id: '5',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'Alicia Berenson\'s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London\'s most desirable areas. One evening, her husband Gabriel returns home late from work, and Alicia shoots him five times in the face, and then never speaks another word.',
    ISBN: '9781250301697',
    price: 27.99,
    discount: 10,
    category: 'Mystery',
    tags: ['thriller', 'psychological', 'suspense'],
    stock: 95,
    language: 'English',
    publisher: 'Celadon Books',
    publishedDate: new Date('2019-02-05'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.6,
    ratingCount: 4567,
    createdAt: new Date('2019-01-15'),
    updatedAt: new Date('2019-02-05')
  },
  {
    _id: '6',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    description: 'For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say.',
    ISBN: '9780735219090',
    price: 29.99,
    discount: 5,
    category: 'Fiction',
    tags: ['fiction', 'mystery', 'nature'],
    stock: 160,
    language: 'English',
    publisher: 'G.P. Putnam\'s Sons',
    publishedDate: new Date('2018-08-14'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.7,
    ratingCount: 6789,
    createdAt: new Date('2018-08-01'),
    updatedAt: new Date('2018-08-14')
  },
  {
    _id: '7',
    title: 'Educated',
    author: 'Tara Westover',
    description: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara\'s older brothers became violent.',
    ISBN: '9780399590504',
    price: 28.99,
    discount: 0,
    category: 'Biography',
    tags: ['memoir', 'education', 'inspirational'],
    stock: 110,
    language: 'English',
    publisher: 'Random House',
    publishedDate: new Date('2018-02-20'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.8,
    ratingCount: 7890,
    createdAt: new Date('2018-02-01'),
    updatedAt: new Date('2018-02-20')
  },
  {
    _id: '8',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission - and if he fails, humanity and the earth itself will perish. Except that right now, he doesn\'t know that. He can\'t even remember his own name, let alone the nature of his assignment or how to complete it.',
    ISBN: '9780593135204',
    price: 28.99,
    discount: 10,
    category: 'Sci-Fi',
    tags: ['sci-fi', 'adventure', 'humor'],
    stock: 140,
    language: 'English',
    publisher: 'Ballantine Books',
    publishedDate: new Date('2021-05-04'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.9,
    ratingCount: 12345,
    createdAt: new Date('2021-04-15'),
    updatedAt: new Date('2021-05-04')
  },
  {
    _id: '9',
    title: 'It Ends With Us',
    author: 'Colleen Hoover',
    description: 'Lily hasn\'t always had it easy, but that\'s never stopped her from working hard for the life she wants. She\'s come a long way from the small town in Maine where she grew up - she graduated from college, moved to Boston, and started her own business.',
    ISBN: '9781501110368',
    price: 16.99,
    discount: 15,
    category: 'Romance',
    tags: ['romance', 'drama', 'contemporary'],
    stock: 200,
    language: 'English',
    publisher: 'Atria Books',
    publishedDate: new Date('2016-08-02'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.6,
    ratingCount: 9876,
    createdAt: new Date('2016-07-15'),
    updatedAt: new Date('2016-08-02')
  },
  {
    _id: '10',
    title: 'The Four Winds',
    author: 'Kristin Hannah',
    description: 'Texas, 1934. Millions are out of work and a drought has broken the Great Plains. Farmers are fighting to keep their land and their livelihoods as the crops are failing, the water is drying up, and dust threatens to bury them all.',
    ISBN: '9781250178602',
    price: 28.99,
    discount: 0,
    category: 'Fiction',
    tags: ['historical', 'fiction', 'drama'],
    stock: 130,
    language: 'English',
    publisher: 'St. Martin\'s Press',
    publishedDate: new Date('2021-02-02'),
    image: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    ratingAvg: 4.7,
    ratingCount: 5432,
    createdAt: new Date('2021-01-15'),
    updatedAt: new Date('2021-02-02')
  }
];

export const DUMMY_USERS: User[] = [
  {
    _id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    address: {
      fullName: 'John Doe',
      phone: '1234567890',
      addressLine: '123 Main Street',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      country: 'USA',
      isDefault: true
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: 'user_2',
    name: 'Admin User',
    email: 'admin@booknest.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const DUMMY_ORDERS: Order[] = [
  {
    _id: 'order_1',
    userId: 'user_1',
    items: [
      {
        bookId: '1',
        title: 'The Midnight Library',
        quantity: 1,
        price: 24.99
      },
      {
        bookId: '2',
        title: 'Atomic Habits',
        quantity: 2,
        price: 19.99
      }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      phone: '1234567890',
      addressLine: '123 Main Street',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      country: 'USA'
    },
    paymentInfo: {
      method: 'CARD',
      status: 'paid',
      razorpayOrderId: 'order_123',
      razorpayPaymentId: 'pay_123',
      razorpaySignature: 'sig_123',
      paidAt: new Date('2024-01-15')
    },
    pricing: {
      subtotal: 64.97,
      discount: 5.00,
      deliveryCharges: 0,
      total: 59.97
    },
    orderStatus: 'delivered',
    shippingInfo: {
      carrier: 'FedEx',
      trackingNumber: 'TRK123456',
      estimatedDeliveryDate: new Date('2024-01-20'),
      shippedAt: new Date('2024-01-16')
    },
    deliveredAt: new Date('2024-01-19'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-19')
  }
];