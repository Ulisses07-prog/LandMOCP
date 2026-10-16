'use client';

import React from 'react';
import Link from 'next/link';

interface Shortcut {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  badge?: string;
  image: string;
}

const SHORTCUTS: Shortcut[] = [
  {
    id: 'ofertas',
    label: 'Até 30% OFF',
    sublabel: 'SUPER OFERTAS',
    href: '/ofertas',
    badge: 'OFERTAS',
    image: '/images/ambiente-portateis.webp',
  },
  {
    id: 'quartos',
    label: 'Quartos',
    sublabel: 'Roupeiros & Camas',
    href: '/categoria/moveis-para-quarto',
    image: '/images/ambiente-quarto.webp',
  },
  {
    id: 'salas',
    label: 'Salas',
    sublabel: 'Sofás & Racks',
    href: '/categoria/moveis-para-sala',
    image: '/images/ambiente-sala.webp',
  },
  {
    id: 'cozinhas',
    label: 'Cozinhas',
    sublabel: 'Armários & Mesas',
    href: '/categoria/cozinha-sala-de-jantar',
    image: '/images/ambiente-cozinha.webp',
  },
  {
    id: 'eletros',
    label: 'Eletrodomésticos',
    sublabel: 'Refrigeradores & Fogões',
    href: '/categoria/eletrodomesticos',
    image: '/images/ambiente-eletro.webp',
  },
  {
    id: 'tvs',
    label: "TV's & Áudio",
    sublabel: 'Smart 4K & Sons',
    href: '/categoria/tv-e-audio',
    image: '/images/ambiente-tv.webp',
  },
  {
    id: 'pronta-entrega',
    label: 'Pronta Entrega',
    sublabel: 'Envio Imediato',
    href: '/catalogo?pronta_entrega=true',
    badge: 'ESTOQUE',
    image: '/images/hero-sala.webp',
  },
];

export default function QuickShortcuts() {
  return (
    <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="no-scrollbar"
        >
          {SHORTCUTS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
                textDecoration: 'none',
                width: '92px',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
              }}
              className="btn-hover"
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: item.badge ? '2px solid var(--color-accent-highlight)' : '2px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 3, 69, 0.08)',
                  backgroundColor: 'var(--color-brand-primary)',
                  marginBottom: '0.45rem',
                }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'var(--color-accent-highlight)',
                      color: 'var(--color-brand-primary)',
                      fontSize: '0.5625rem',
                      fontWeight: 900,
                      padding: '1px 0',
                      letterSpacing: '0.04em',
                      textAlign: 'center',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--color-brand-primary)',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
