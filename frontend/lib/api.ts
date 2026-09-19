import { Product, Category, Offer, ApiResponse, SubgroupItem } from '@/types/catalog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://landmocp.onrender.com';

export async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

// Mock fallback para garantir que o build do Next.js gere páginas perfeitamente
// Mock fallback com os 9 Departamentos Oficiais da Arruda Móveis
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Móveis para Sala', slug: 'moveis-para-sala', sort_order: 1, active: true },
  { id: 2, name: 'Móveis para Quarto', slug: 'moveis-para-quarto', sort_order: 2, active: true },
  { id: 3, name: 'Cozinha & Sala de Jantar', slug: 'cozinha-sala-de-jantar', sort_order: 3, active: true },
  { id: 4, name: 'Eletrodomésticos', slug: 'eletrodomesticos', sort_order: 4, active: true },
  { id: 5, name: 'Eletroportáteis', slug: 'eletroportateis', sort_order: 5, active: true },
  { id: 6, name: 'TV & Áudio', slug: 'tv-e-audio', sort_order: 6, active: true },
  { id: 7, name: 'Telefonia & Informática', slug: 'telefonia-e-informatica', sort_order: 7, active: true },
  { id: 8, name: 'Ar & Climatização', slug: 'ar-e-climatizacao', sort_order: 8, active: true },
  { id: 9, name: 'Decoração & Utilidades', slug: 'decoracao-e-utilidades', sort_order: 9, active: true },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: 'Sofá Retrátil e Reclinável 3 Lugares Veludo',
    slug: 'sofa-retratil-reclinavel-3-lugares-veludo',
    sku: 'ARR-SOF-001',
    price: 1899.90,
    old_price: 2199.90,
    promo_price: 1599.90,
    payment_condition: '10x de R$ 159,99 sem juros',
    dimensions: '210 x 95 x 100 cm',
    material: 'Madeira de Eucalipto e Espuma D28',
    color: 'Azul Veludo',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 1, storage_key: 'mock-sofa.webp', url: '/images/mock-sofa.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 1,
      product_id: 1,
      promo_price: 1599.90,
      discount_percent: 16,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 2,
    category_id: 2,
    name: 'Guarda-Roupa Casal 6 Portas com Espelho',
    slug: 'guarda-roupa-casal-6-portas-com-espelho',
    sku: 'ARR-GDR-002',
    price: 1499.00,
    old_price: 1699.00,
    promo_price: 1299.00,
    payment_condition: '10x de R$ 129,90 sem juros',
    dimensions: '200 x 190 x 45 cm',
    material: 'MDP Reforçado',
    color: 'Freijó / Off White',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 2, storage_key: 'mock-quarto.webp', url: '/images/mock-quarto.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 2,
      product_id: 2,
      promo_price: 1299.00,
      discount_percent: 13,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 3,
    category_id: 6,
    name: 'Smart TV 55 Polegadas 4K UHD HDR',
    slug: 'smart-tv-55-polegadas-4k-uhd-hdr',
    sku: 'ARR-TV-003',
    price: 2799.00,
    old_price: 3199.00,
    promo_price: 2399.00,
    payment_condition: '10x de R$ 239,90 sem juros',
    dimensions: '123 x 71 x 6 cm',
    material: 'Tecnologia LED 4K',
    color: 'Preto',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 3, storage_key: 'mock-tv.webp', url: '/images/mock-tv.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 3,
      product_id: 3,
      promo_price: 2399.00,
      discount_percent: 14,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 4,
    category_id: 4,
    name: 'Geladeira Frost Free Duplex 375L Inox',
    slug: 'geladeira-frost-free-duplex-375l-inox',
    sku: 'ARR-GEL-004',
    price: 3299.00,
    old_price: 3699.00,
    promo_price: 2899.00,
    payment_condition: '10x de R$ 289,90 sem juros',
    dimensions: '176 x 62 x 75 cm',
    material: 'Evox Inox',
    color: 'Inox',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 4, storage_key: 'mock-geladeira.webp', url: '/images/mock-geladeira.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 4,
      product_id: 4,
      promo_price: 2899.00,
      discount_percent: 12,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
];

export async function getCategories(): Promise<Category[]> {
  const data = await fetchFromApi<Category[]>('/categories');
  return data && data.length > 0 ? data : MOCK_CATEGORIES;
}

export interface GetProductsOptions {
  categoryId?: number;
  subgroup?: string;
  search?: string;
  pageSize?: number;
  page?: number;
  inStockOnly?: boolean;
  status?: string;
}

export async function getProducts(options?: GetProductsOptions): Promise<Product[]> {
  const params = new URLSearchParams();
  if (options?.categoryId) params.append('category_id', String(options.categoryId));
  if (options?.subgroup) params.append('subgroup', options.subgroup);
  if (options?.search) params.append('search', options.search);
  if (options?.pageSize) params.append('page_size', String(options.pageSize));
  if (options?.page) params.append('page', String(options.page));
  if (options?.inStockOnly) params.append('in_stock_only', 'true');
  if (options?.status) params.append('status', options.status);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchFromApi<Product[]>(`/products${queryStr}`);
  
  if (data && data.length > 0) return data;
  
  // Fallback caso backend esteja offline
  if (options?.categoryId) {
    return MOCK_PRODUCTS.filter((p) => p.category_id === options.categoryId);
  }
  return MOCK_PRODUCTS;
}

export async function getSubgroups(categoryId?: number): Promise<SubgroupItem[]> {
  const query = categoryId ? `?category_id=${categoryId}` : '';
  const data = await fetchFromApi<SubgroupItem[]>(`/products/subgroups${query}`);
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchFromApi<Product>(`/products/${slug}`);
  if (data) return data;
  return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
}
