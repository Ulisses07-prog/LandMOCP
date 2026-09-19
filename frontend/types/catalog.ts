export interface ProductImage {
  id: number;
  storage_key: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  width?: number;
  height?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  active: boolean;
}

export interface Offer {
  id: number;
  product_id: number;
  promo_price: number;
  discount_percent?: number;
  starts_at: string;
  ends_at: string;
  promotional_text?: string;
  featured: boolean;
  active: boolean;
  status: 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'DISABLED';
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku?: string;
  brand?: string;
  group_name?: string;
  subgroup?: string;
  short_description?: string;
  description?: string;
  price: number;
  old_price?: number;
  promo_price?: number;
  payment_condition?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: string;
  availability: string;
  stock?: number;
  is_featured: boolean;
  status: string;
  images: ProductImage[];
  offer?: Offer;
  category?: Category;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
  };
}

export interface SubgroupItem {
  name: string;
  count: number;
}
