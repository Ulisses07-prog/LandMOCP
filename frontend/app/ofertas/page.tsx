import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getProducts, MOCK_PRODUCTS } from '@/lib/api';
import { Product } from '@/types/catalog';

// Ofertas oficiais da campanha Aniversário 33 Anos da Arruda Móveis (01 a 30 de Novembro)
const OFERTAS_ENCARTE_ARRUDA: Product[] = [
  {
    id: 99001,
    category_id: 8,
    name: 'Ar-Condicionado Elgin/Philco 9000 BTUs',
    slug: 'ar-condicionado-elgin-philco-9000-btus',
    sku: 'ARR-AR-001',
    price: 3175.0,
    old_price: 3175.0,
    promo_price: 2499.9,
    payment_condition: '10x de R$ 269,88 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99001, storage_key: '/images/promocoes/oferta-ar-condicionado.webp', url: '/images/promocoes/oferta-ar-condicionado.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99001,
      product_id: 99001,
      promo_price: 2499.9,
      discount_percent: 21,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99002,
    category_id: 4,
    name: 'Refrigerador Consul 2 Portas 332L CRD37',
    slug: 'refrigerador-consul-2-portas-332l-crd37',
    sku: 'ARR-REF-002',
    price: 3999.9,
    old_price: 3999.9,
    promo_price: 2899.9,
    payment_condition: '10x de R$ 339,99 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99002, storage_key: '/images/promocoes/oferta-refrigerador-consul.webp', url: '/images/promocoes/oferta-refrigerador-consul.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99002,
      product_id: 99002,
      promo_price: 2899.9,
      discount_percent: 28,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99003,
    category_id: 6,
    name: 'Smart TV 32" AOC / SEMP',
    slug: 'smart-tv-32-aoc-semp',
    sku: 'ARR-TV-003',
    price: 1699.9,
    old_price: 1699.9,
    promo_price: 999.9,
    payment_condition: '10x de R$ 144,49 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99003, storage_key: '/images/promocoes/oferta-tv-32.webp', url: '/images/promocoes/oferta-tv-32.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99003,
      product_id: 99003,
      promo_price: 999.9,
      discount_percent: 41,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99004,
    category_id: 3,
    name: 'Kit Cozinha Telasul Diamante 6 Portas',
    slug: 'kit-cozinha-telasul-diamante-6-portas',
    sku: 'ARR-COZ-004',
    price: 1280.0,
    old_price: 1280.0,
    promo_price: 899.9,
    payment_condition: '10x de R$ 108,57 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99004, storage_key: '/images/promocoes/oferta-kit-telasul.webp', url: '/images/promocoes/oferta-kit-telasul.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99004,
      product_id: 99004,
      promo_price: 899.9,
      discount_percent: 30,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99005,
    category_id: 2,
    name: 'Roupeiro Capelinha BS07 com Espelho',
    slug: 'roupeiro-capelinha-bs07-com-espelho',
    sku: 'ARR-ROU-005',
    price: 1195.0,
    old_price: 1195.0,
    promo_price: 799.9,
    payment_condition: '10x de R$ 101,58 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99005, storage_key: '/images/promocoes/oferta-roupeiro-capelinha.webp', url: '/images/promocoes/oferta-roupeiro-capelinha.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99005,
      product_id: 99005,
      promo_price: 799.9,
      discount_percent: 33,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99006,
    category_id: 4,
    name: 'Fogão Realce 4 BC Xodó',
    slug: 'fogao-realce-4-bc-xodo',
    sku: 'ARR-FOG-006',
    price: 965.0,
    old_price: 965.0,
    promo_price: 679.9,
    payment_condition: '10x de R$ 82,03 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99006, storage_key: '/images/promocoes/oferta-fogao-realce.webp', url: '/images/promocoes/oferta-fogao-realce.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99006,
      product_id: 99006,
      promo_price: 679.9,
      discount_percent: 30,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99007,
    category_id: 4,
    name: 'Lavadora Wanke 10KG',
    slug: 'lavadora-wanke-10kg',
    sku: 'ARR-LAV-007',
    price: 825.0,
    old_price: 825.0,
    promo_price: 555.0,
    payment_condition: '10x de R$ 70,13 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99007, storage_key: '/images/promocoes/oferta-lavadora-wanke.webp', url: '/images/promocoes/oferta-lavadora-wanke.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99007,
      product_id: 99007,
      promo_price: 555.0,
      discount_percent: 33,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99008,
    category_id: 1,
    name: 'Rack Tuboart Camille',
    slug: 'rack-tuboart-camille',
    sku: 'ARR-RAC-008',
    price: 699.9,
    old_price: 699.9,
    promo_price: 499.9,
    payment_condition: '10x de R$ 59,49 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99008, storage_key: '/images/promocoes/oferta-rack-camille.webp', url: '/images/promocoes/oferta-rack-camille.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99008,
      product_id: 99008,
      promo_price: 499.9,
      discount_percent: 29,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99009,
    category_id: 8,
    name: 'Ventilador Mondial Coluna 40CM VSP40',
    slug: 'ventilador-mondial-coluna-40cm-vsp40',
    sku: 'ARR-VEN-009',
    price: 420.0,
    old_price: 420.0,
    promo_price: 295.0,
    payment_condition: '10x de R$ 35,70 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99009, storage_key: '/images/promocoes/oferta-ventilador-coluna.webp', url: '/images/promocoes/oferta-ventilador-coluna.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99009,
      product_id: 99009,
      promo_price: 295.0,
      discount_percent: 30,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99010,
    category_id: 8,
    name: 'Ventilador Mondial Mesa 40CM VSP40',
    slug: 'ventilador-mondial-mesa-40cm-vsp40',
    sku: 'ARR-VEN-010',
    price: 270.0,
    old_price: 270.0,
    promo_price: 199.9,
    payment_condition: '10x de R$ 24,19 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99010, storage_key: '/images/promocoes/oferta-ventilador-mesa-40cm.webp', url: '/images/promocoes/oferta-ventilador-mesa-40cm.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99010,
      product_id: 99010,
      promo_price: 199.9,
      discount_percent: 26,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
  {
    id: 99011,
    category_id: 8,
    name: 'Ventilador Ultra Mesa 30CM V-30',
    slug: 'ventilador-ultra-mesa-30cm-v-30',
    sku: 'ARR-VEN-011',
    price: 185.0,
    old_price: 185.0,
    promo_price: 135.0,
    payment_condition: '10x de R$ 16,33 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99011, storage_key: '/images/promocoes/oferta-ventilador-mesa-30cm.webp', url: '/images/promocoes/oferta-ventilador-mesa-30cm.webp', sort_order: 1, is_primary: true }],
    offer: {
      id: 99011,
      product_id: 99011,
      promo_price: 135.0,
      discount_percent: 27,
      starts_at: '2026-11-01',
      ends_at: '2026-11-30',
      featured: true,
      active: true,
      status: 'ACTIVE',
    },
  },
];

export default async function OfertasPage() {
  const products = await getProducts({ pageSize: 100 });

  // Ofertas ativas vindas do banco de dados
  const apiOffers = (products || []).filter((p) => {
    const promo = p.promo_price ? Number(p.promo_price) : 0;
    const regular = p.price ? Number(p.price) : 0;
    return promo > 0 && promo < regular;
  });

  // Ofertas ativas: sempre prioriza o encarte oficial de Aniversário 33 Anos
  const offers = [
    ...OFERTAS_ENCARTE_ARRUDA,
    ...(apiOffers || []).filter(
      (p) => !OFERTAS_ENCARTE_ARRUDA.some((o) => o.name.toLowerCase() === p.name.toLowerCase())
    ),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '3rem 0' }}>
        <div className="container">
          {/* Cabeçalho da Página de Ofertas */}
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              marginBottom: '2.5rem',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-accent-highlight)',
                color: 'var(--color-brand-primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.8125rem',
                marginBottom: '0.75rem',
              }}
            >
              🎉 ANIVERSÁRIO 33 ANOS ARRUDA MÓVEIS
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              Ofertas Oficiais de Aniversário
            </h1>
            <p style={{ color: '#78350f', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
              O aniversário é nosso, mas o presente é para você! Ofertas válidas de 01 a 30 de Novembro em todas as 8 lojas
              físicas e pelo atendimento no WhatsApp com pronta entrega.
            </p>
          </div>

          {/* Grid de Ofertas */}
          {offers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                Nenhuma oferta ativa no momento. Confira nosso catálogo completo!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {offers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
