'use client';

import React from 'react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  badge?: string;
}

const DEPARTAMENTOS: CategoryItem[] = [
  { id: '1', name: 'Sala de Estar', slug: 'moveis-para-sala', image: '/images/ambiente-sala.webp', badge: 'Destaque' },
  { id: '2', name: 'Quarto & Casal', slug: 'moveis-para-quarto', image: '/images/ambiente-quarto.webp' },
  { id: '3', name: 'Cozinha & Jantar', slug: 'cozinha-sala-de-jantar', image: '/images/ambiente-cozinha.webp' },
  { id: '4', name: 'Eletros & Fogões', slug: 'eletrodomesticos', image: '/images/ambiente-eletro.webp', badge: 'Em Oferta' },
  { id: '5', name: 'TV & Som 4K', slug: 'tv-e-audio', image: '/images/ambiente-tv.webp' },
  { id: '6', name: 'Eletroportáteis', slug: 'eletroportateis', image: '/images/ambiente-portateis.webp' },
  { id: '7', name: 'Climatização', slug: 'ar-e-climatizacao', image: '/images/ambiente-portateis.webp' },
  { id: '8', name: 'Colchões & Box', slug: 'colchoes', image: '/images/ambiente-quarto.webp' },
  { id: '9', name: 'Estofados', slug: 'estofados', image: '/images/ambiente-sala.webp', badge: 'Pronta Entrega' },
];

export default function ArrudaCategorySlider() {
  return (
    <section style={{ padding: '2rem 0 1.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-brand-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Departamentos Arruda
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-brand-primary)', margin: 0 }}>
              Navegue por Ambientes da Casa
            </h2>
          </div>
          <Link
            href="/catalogo"
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--color-brand-accent)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Ver tudo →
          </Link>
        </div>

        {/* Trilho de Scroll Horizontal Circular */}
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            paddingTop: '0.25rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="hide-scrollbar"
        >
          {DEPARTAMENTOS.map((dep) => (
            <Link
              key={dep.id}
              href={`/catalogo?categoria=${dep.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '88px',
                textAlign: 'center',
                textDecoration: 'none',
                position: 'relative',
              }}
              className="btn-hover"
            >
              {/* Círculo com foto e borda dourada */}
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, var(--color-accent-highlight) 100%)',
                  boxShadow: '0 4px 12px rgba(15, 3, 69, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <img
                    src={dep.image}
                    alt={dep.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </div>

                {dep.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      backgroundColor: 'var(--color-brand-primary)',
                      color: 'var(--color-accent-highlight)',
                      fontSize: '0.625rem',
                      fontWeight: 900,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-accent-highlight)',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.2,
                    }}
                  >
                    {dep.badge}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.2,
                  maxWidth: '85px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {dep.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
