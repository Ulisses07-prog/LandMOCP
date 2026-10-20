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
    name: 'Roupeiro ACP Maya 6 Portas com Espelho',
    slug: 'roupeiro-acp-maya-06pts-mdp',
    sku: 'ARR-ACP-MAY-006',
    price: 1499.00,
    old_price: 1699.00,
    promo_price: 1299.00,
    payment_condition: '10x de R$ 129,90 sem juros',
    dimensions: '200 x 190 x 45 cm',
    material: 'MDP Reforçado',
    color: 'Cinamomo / Off White',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [
      { id: 2, storage_key: 'produtos/acp/04_maya-6pt_cinamomo_offwhite_fix6_easy-resize_com.webp', url: '/produtos/acp/04_maya-6pt_cinamomo_offwhite_fix6_easy-resize_com.webp', sort_order: 1, is_primary: true },
      { id: 22, storage_key: 'produtos/acp/04_maya-6pt_branco_easy-resize_com.webp', url: '/produtos/acp/04_maya-6pt_branco_easy-resize_com.webp', sort_order: 2, is_primary: false }
    ],
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
  {
    id: 99001,
    category_id: 4,
    name: 'Fogão Realce 4 BC Xodó',
    slug: 'fogao-realce-4-bc-xodo',
    sku: 'ARR-FOG-001',
    price: 965.0,
    old_price: 965.0,
    promo_price: 679.9,
    payment_condition: '10x de R$ 82,03 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99001, storage_key: '/images/promocoes/oferta-fogao-realce.webp', url: '/images/promocoes/oferta-fogao-realce.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99001,
      product_id: 99001,
      promo_price: 679.9,
      discount_percent: 30,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99002,
    category_id: 4,
    name: 'Lavadora Wanke 10KG',
    slug: 'lavadora-wanke-10kg',
    sku: 'ARR-LAV-002',
    price: 825.0,
    old_price: 825.0,
    promo_price: 555.0,
    payment_condition: '10x de R$ 70,13 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99002, storage_key: '/images/promocoes/oferta-lavadora-wanke.webp', url: '/images/promocoes/oferta-lavadora-wanke.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99002,
      product_id: 99002,
      promo_price: 555.0,
      discount_percent: 33,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99003,
    category_id: 2,
    name: 'Roupeiro ACP Débora Capelinha com Espelho',
    slug: 'roupeiro-acp-debora-04pts-capelinha-c-esp',
    sku: 'ARR-ACP-DEB-004',
    price: 1195.0,
    old_price: 1195.0,
    promo_price: 799.9,
    payment_condition: '10x de R$ 101,58 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99003, storage_key: 'produtos/acp/debora-4pts-branco_easy-resize_com_-3.webp', url: '/produtos/acp/debora-4pts-branco_easy-resize_com_-3.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99003,
      product_id: 99003,
      promo_price: 799.9,
      discount_percent: 33,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99004,
    category_id: 6,
    name: 'Smart TV 32" AOC / SEMP',
    slug: 'smart-tv-32-aoc-semp',
    sku: 'ARR-TV-004',
    price: 1699.9,
    old_price: 1699.9,
    promo_price: 999.9,
    payment_condition: '10x de R$ 144,49 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99004, storage_key: '/images/promocoes/oferta-tv-32.webp', url: '/images/promocoes/oferta-tv-32.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99004,
      product_id: 99004,
      promo_price: 999.9,
      discount_percent: 41,
      starts_at: '2026-01-01',
      ends_at: '2026-12-31',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99005,
    category_id: 8,
    name: 'Ventilador Mondial 40CM',
    slug: 'ventilador-mondial-40cm',
    sku: 'ARR-VEN-005',
    price: 420.0,
    old_price: 420.0,
    promo_price: 295.0,
    payment_condition: '10x de R$ 35,70 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99005, storage_key: '/images/promocoes/oferta-ventilador-mondial.webp', url: '/images/promocoes/oferta-ventilador-mondial.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99005,
      product_id: 99005,
      promo_price: 295.0,
      discount_percent: 30,
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
  if (options?.search) {
    // Normaliza busca removendo acentos para compatibilidade total com o banco de dados
    const normalized = options.search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    params.append('search', normalized);
  }
  if (options?.pageSize) params.append('page_size', String(options.pageSize));
  if (options?.page) params.append('page', String(options.page));
  if (options?.inStockOnly) params.append('in_stock_only', 'true');
  if (options?.status) params.append('status', options.status);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchFromApi<Product[]>(`/products${queryStr}`);
  
  if (data !== null) return data;
  
  // Fallback caso backend esteja offline
  let fallback = MOCK_PRODUCTS;
  if (options?.categoryId) {
    fallback = fallback.filter((p) => p.category_id === options.categoryId);
  }
  if (options?.subgroup) {
    const sub = options.subgroup.toLowerCase();
    fallback = fallback.filter((p) => (p.subgroup || '').toLowerCase() === sub);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    fallback = fallback.filter((p) => p.name.toLowerCase().includes(s) || (p.sku || '').toLowerCase().includes(s));
  }
  return fallback;
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
