export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  ISBN: string;
  price: number;
  discount: number;
  category: 'Fiction' | 'Non-Fiction' | 'Sci-Fi' | 'Biography' | 'Romance' | 'Mystery' | 'Fantasy';
  tags: string[];
  stock: number;
  language: string;
  publisher: string;
  publishedDate: Date;
  image: string[];
  ratingAvg: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Computed properties
  discountedPrice?: number;
  inStock?: boolean;
}

export interface RelatedBooks {
  bySameAuthor: Book[];
  bySameCategory: Book[];
  popularPicks: Book[]; 
}