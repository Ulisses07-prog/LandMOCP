import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getProducts, MOCK_PRODUCTS } from '@/lib/api';
import { Product } from '@/types/catalog';

// Ofertas oficiais do encarte Arruda Móveis para exibição contínua
const OFERTAS_ENCARTE_ARRUDA: Product[] = [
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
    name: 'Roupeiro Capelinha com Espelho',
    slug: 'roupeiro-capelinha-com-espelho',
    sku: 'ARR-ROU-003',
    price: 1195.0,
    old_price: 1195.0,
    promo_price: 799.9,
    payment_condition: '10x de R$ 101,58 nos cartões',
    availability: 'Pronta Entrega',
    is_featured: true,
    status: 'PUBLISHED',
    images: [{ id: 99003, storage_key: '/images/promocoes/oferta-roupeiro-capelinha.webp', url: '/images/promocoes/oferta-roupeiro-capelinha.webp', sort_order: 1, is_primary: true }],
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

export default async function OfertasPage() {
  const products = await getProducts({ pageSize: 100 });

  // Ofertas ativas vindas do banco de dados
  const apiOffers = (products || []).filter((p) => {
    const promo = p.promo_price ? Number(p.promo_price) : 0;
    const regular = p.price ? Number(p.price) : 0;
    return promo > 0 && promo < regular;
  });

  // Fallback permanente: encarte oficial + produtos modelo
  const fallbackOffers = [
    ...OFERTAS_ENCARTE_ARRUDA,
    ...MOCK_PRODUCTS.filter((p) => p.promo_price && Number(p.promo_price) < Number(p.price)),
  ];

  const offers = apiOffers.length > 0 ? apiOffers : fallbackOffers;

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
              🔥 OFERTAS ATIVAS
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              Ofertas da Semana Arruda Móveis
            </h1>
            <p style={{ color: '#78350f', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Preços promocionais por tempo limitado. Aproveite as melhores condições e fale direto com nossa equipe
              comercial no WhatsApp.
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
