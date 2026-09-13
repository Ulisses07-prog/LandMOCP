import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/api';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const offers = products.filter((p) => p.promo_price && p.promo_price < p.price);
  const featured = products.filter((p) => p.is_featured);
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* Hero Banner Comercial */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0b172a 0%, #1e293b 100%)',
            color: 'var(--color-text-inverse)',
            padding: '4.5rem 0',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '840px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(250, 204, 21, 0.15)',
                color: 'var(--color-accent-highlight)',
                padding: '0.35rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
              }}
            >
              🎉 Catálogo Oficial & Ofertas da Semana
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Móveis e Eletros com as melhores condições direto na sua casa
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-border)',
                marginBottom: '2.25rem',
                lineHeight: 1.6,
              }}
            >
              Qualidade garantida, parcelamento facilitado e atendimento exclusivo via WhatsApp. Consulte nosso
              catálogo completo de pronta entrega.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/catalogo"
                style={{
                  backgroundColor: 'var(--color-accent-highlight)',
                  color: 'var(--color-brand-primary)',
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                VER CATÁLOGO COMPLETO
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--color-whatsapp)',
                  color: '#ffffff',
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: 'var(--shadow-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>FALAR NO WHATSAPP</span>
              </a>
            </div>
          </div>
        </section>

        {/* Categorias Rápidas */}
        <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--color-bg-base)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                  Compre por Categoria
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
                  Explore nossos departamentos e encontre o que precisa
                </p>
              </div>
              <Link href="/catalogo" style={{ color: 'var(--color-brand-accent)', fontWeight: 600, fontSize: '0.875rem' }}>
                Ver todas →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '1rem',
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem 1rem',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                  }}
                  className="cat-card"
                >
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                    {cat.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
                    Ver ofertas →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Vitrine: Ofertas da Semana */}
        {offers.length > 0 && (
          <section style={{ padding: '3.5rem 0', backgroundColor: '#fffbeb', borderTop: '1px solid #fef3c7', borderBottom: '1px solid #fef3c7' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
                <div>
                  <span style={{ color: '#b45309', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Oportunidades Imperdíveis
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                    🔥 Ofertas da Semana
                  </h2>
                </div>
                <Link href="/ofertas" style={{ color: '#b45309', fontWeight: 700, fontSize: '0.9375rem' }}>
                  Ver todas as ofertas →
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {offers.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Vitrine: Destaques */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                ⭐ Produtos em Destaque
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
                Os itens mais procurados e com entrega rápida
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
