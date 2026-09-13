import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/api';
import { getWhatsAppUrl } from '@/lib/whatsapp';

// Mapeamento de ícones visuais para cada departamento
const CATEGORY_ICONS: Record<string, string> = {
  'moveis-para-sala': '🛋️',
  'moveis-para-quarto': '🛏️',
  'cozinha-sala-de-jantar': '🍳',
  'eletrodomesticos': '🧊',
  'eletroportateis': '☕',
  'tv-e-audio': '📺',
  'telefonia-e-informatica': '📱',
  'ar-e-climatizacao': '❄️',
  'decoracao-e-utilidades': '🏺',
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const offers = products.filter((p) => p.promo_price && Number(p.promo_price) < Number(p.price));
  const featured = products.filter((p) => p.is_featured);
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* Hero Banner Comercial */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0f0345 0%, #1a0b5c 50%, #2b2f69 100%)',
            padding: '4rem 0 3.5rem 0',
            textAlign: 'center',
            color: '#ffffff',
            borderBottom: '4px solid var(--color-accent-highlight)',
          }}
        >
          <div className="container" style={{ maxWidth: '880px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(254, 248, 38, 0.18)',
                color: 'var(--color-accent-highlight)',
                border: '1px solid rgba(254, 248, 38, 0.4)',
                padding: '0.4rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                marginBottom: '1.25rem',
              }}
            >
              ⭐ CATÁLOGO DIGITAL & OFERTAS EXCLUSIVAS
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.025em',
                color: '#ffffff',
              }}
            >
              Móveis e Eletros com os Melhores Preços da Região
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: '#e2e8f0',
                marginBottom: '2.25rem',
                lineHeight: 1.6,
                maxWidth: '720px',
                margin: '0 auto 2.25rem auto',
              }}
            >
              Qualidade garantida, condições de pagamento facilitadas e atendimento personalizado com orçamento rápido pelo WhatsApp.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/catalogo"
                className="btn-hover"
                style={{
                  backgroundColor: 'var(--color-accent-highlight)',
                  color: 'var(--color-brand-primary)',
                  padding: '0.95rem 2.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 14px rgba(254, 248, 38, 0.4)',
                  display: 'inline-block',
                }}
              >
                VER CATÁLOGO COMPLETO
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  backgroundColor: 'var(--color-whatsapp)',
                  color: '#ffffff',
                  padding: '0.95rem 2.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>FALAR COM UM VENDEDOR</span>
              </a>
            </div>
          </div>
        </section>

        {/* Barra de Pilares de Confiança */}
        <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 0' }}>
          <div className="container">
            <div className="pillars-grid">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '1.75rem' }}>🚚</span>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Entrega Segura</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Agilidade e cuidado na sua entrega</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '1.75rem' }}>💳</span>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Pagamento Facilitado</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Até 10x no cartão ou à vista</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '1.75rem' }}>💬</span>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Atendimento Direto</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Negociação humanizada no WhatsApp</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '1.75rem' }}>🛡️</span>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Garantia & Confiança</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Produtos novos com nota fiscal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departamentos da Loja */}
        <section style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-brand-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Departamentos Oficiais
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                  Compre por Categoria
                </h2>
              </div>
              <Link
                href="/catalogo"
                style={{
                  color: 'var(--color-brand-accent)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Ver todas</span> →
              </Link>
            </div>

            <div className="category-grid">
              {categories.map((cat) => {
                const icon = CATEGORY_ICONS[cat.slug] || '📦';
                return (
                  <Link
                    key={cat.id}
                    href={`/categoria/${cat.slug}`}
                    className="card-hover"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem 1rem',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                    }}
                  >
                    <span style={{ fontSize: '2.25rem', display: 'block' }}>{icon}</span>
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        color: 'var(--color-brand-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      {cat.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-brand-accent)',
                        fontWeight: 700,
                      }}
                    >
                      Conferir ofertas →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vitrine: Ofertas da Semana */}
        {offers.length > 0 && (
          <section
            style={{
              padding: '3.5rem 0',
              backgroundColor: '#fffdf0',
              borderTop: '1px solid #fef08a',
              borderBottom: '1px solid #fef08a',
            }}
          >
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                  <span
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'inline-block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    PREÇOS BAIXOS
                  </span>
                  <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--color-brand-primary)' }}>
                    🔥 Ofertas da Semana
                  </h2>
                </div>
                <Link
                  href="/ofertas"
                  style={{
                    color: '#b45309',
                    fontWeight: 800,
                    fontSize: '0.9375rem',
                  }}
                >
                  Ver todas as ofertas →
                </Link>
              </div>

              <div className="products-grid">
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
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  color: 'var(--color-brand-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Seleção Especial
              </span>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                ⭐ Produtos em Destaque
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
                Os itens mais procurados para renovar a sua casa
              </p>
            </div>

            <div className="products-grid">
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
