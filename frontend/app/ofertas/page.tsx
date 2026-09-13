import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';

export default async function OfertasPage() {
  const products = await getProducts();
  const offers = products.filter((p) => p.promo_price && p.promo_price < p.price);

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
