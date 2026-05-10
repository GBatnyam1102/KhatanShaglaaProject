export type ProductStatus = "In Stock" | "Out of Stock" | "Made to Order";
export type InquiryStatus = "new" | "read" | "replied" | "closed";

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  salePrice?: number | null;
  unit?: string;
  categoryId: string;
  image: string;
  images: string[];
  description: string;
  shortDescription?: string;
  material?: string;
  size?: string;
  color?: string;
  stockQuantity?: number | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  status: ProductStatus;
  sortOrder?: number;
}

export interface ProductFormValues {
  name: string;
  slug?: string;
  price: number;
  salePrice?: number | null;
  unit?: string;
  categoryId: string;
  status: ProductStatus;
  description: string;
  shortDescription?: string;
  material?: string;
  size?: string;
  color?: string;
  stockQuantity?: number | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface CategoryFormValues {
  name: string;
  slug?: string;
  image: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface InquiryInput {
  productId?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export interface Inquiry {
  id: string;
  productId: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface DashboardSummary {
  products: Product[];
  categories: Category[];
  inquiries: Inquiry[];
  publishedProducts: number;
  imageCount: number;
  newInquiries: number;
}
