'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  title: string;
  href: string;
  desktopSrc: string;
  mobileSrc: string;
  bgColor: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'mes-da-familia',
    title: 'Arruda Móveis - Mês da Família (01 a 31 de Outubro)',
    href: '/catalogo',
    desktopSrc: '/images/promocoes/banner-mes-familia-desktop.webp',
    mobileSrc: '/images/promocoes/capa-mes-da-familia.webp',
    bgColor: '#cbe700',
  },
  {
    id: 'mega-ofertas',
    title: 'Arruda Móveis - Mega Ofertas em Móveis e Eletros',
    href: '/ofertas',
    desktopSrc: '/images/banner-hero-desktop.webp',
    mobileSrc: '/images/banner-hero-desktop.webp',
    bgColor: '#090326',
  },
];

export default function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);

  // Troca automática a cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  const activeBanner = BANNERS[current];

  return (
    <section
      className="APHeroBanner__Container"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: activeBanner.bgColor,
        margin: 0,
        overflow: 'hidden',
        transition: 'background-color 0.4s ease',
      }}
    >
      <Link
        href={activeBanner.href}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        <picture style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <source media="(max-width: 768px)" srcSet={activeBanner.mobileSrc} />
          <img
            className="APHeroBanner__Picture APHeroBanner__Picture--desktop"
            src={activeBanner.desktopSrc}
            alt={activeBanner.title}
            loading="eager"
            fetchPriority="high"
            style={{
              width: '100%',
              maxWidth: '1920px',
              height: 'auto',
              maxHeight: 'min(520px, 65vh)',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </picture>
      </Link>

      {/* Botões de navegação lateral (estilo Casas Bahia / Armazém Paraíba) */}
      {BANNERS.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            aria-label="Banner anterior"
            className="btn-hover"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              color: 'var(--color-brand-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            aria-label="Próximo banner"
            className="btn-hover"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              color: 'var(--color-brand-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores de pontinhos (Bullets) */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {BANNERS.map((b, idx) => (
              <button
                key={b.id}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(idx);
                }}
                aria-label={`Ir para banner ${idx + 1}`}
                style={{
                  width: current === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: current === idx ? 'var(--color-accent-highlight)' : 'rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s ease',
                  padding: 0,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
