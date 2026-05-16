export interface IProduct {
  id: number;
  title: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  images: string[];
  description: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}