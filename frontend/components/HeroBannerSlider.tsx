'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface BannerSlide {
  id: string;
  title: string;
  href: string;
  desktopSrc: string;
  mobileSrc: string;
  bgColor: string;
  isOffer?: boolean;
  badge?: string;
  category?: string;
  productName?: string;
  oldPrice?: string;
  newPrice?: string;
  installments?: string;
  zapMsg?: string;
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
    id: 'ofertas-relampago-capa',
    title: 'Arruda Móveis - Ofertas Relâmpago 19 a 21 de Outubro',
    href: '#ofertas-relampago',
    desktopSrc: '/images/promocoes/slide-capa-relampago-desk.webp',
    mobileSrc: '/images/promocoes/oferta-capa-relampago.webp',
    bgColor: '#090326',
    isOffer: true,
    badge: '⚡ VÁLIDO DE 19 A 21 DE OUTUBRO',
    category: 'Lojas Esperantina e Batalha - PI',
    productName: 'Mega Ofertas Relâmpago Arruda Móveis',
    oldPrice: 'Preços de Tabela',
    newPrice: 'Até 25% OFF',
    installments: 'Ou em até 10x com 15% de desconto nos cartões',
    zapMsg: 'Olá! Vi a campanha de Ofertas Relâmpago no site da Arruda Móveis e quero consultar os produtos disponíveis.',
  },
  {
    id: 'fogao-realce',
    title: 'Fogão Realce 4 BC Xodó - Por apenas R$ 679,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/promocoes/slide-fogao-realce-desk.webp',
    mobileSrc: '/images/promocoes/oferta-fogao-realce.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 30% • OFERTA RELÂMPAGO',
    category: 'Fogões & Cozinha',
    productName: 'Fogão Realce 4 BC Xodó',
    oldPrice: 'De: R$ 965,00',
    newPrice: 'R$ 679,90',
    installments: 'ou 10x de R$ 82,03 nos cartões',
    zapMsg: 'Olá! Tenho interesse na oferta do Fogão Realce 4 BC Xodó por R$ 679,90 na Arruda Móveis.',
  },
  {
    id: 'lavadora-wanke',
    title: 'Lavadora Wanke 10KG - Por apenas R$ 555,00',
    href: '#ofertas-relampago',
    desktopSrc: '/images/promocoes/slide-lavadora-wanke-desk.webp',
    mobileSrc: '/images/promocoes/oferta-lavadora-wanke.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 33% • OFERTA RELÂMPAGO',
    category: 'Lavadoras & Área de Serviço',
    productName: 'Lavadora Wanke 10KG',
    oldPrice: 'De: R$ 825,00',
    newPrice: 'R$ 555,00',
    installments: 'ou 10x de R$ 70,13 nos cartões',
    zapMsg: 'Olá! Tenho interesse na oferta da Lavadora Wanke 10KG por R$ 555,00 na Arruda Móveis.',
  },
  {
    id: 'roupeiro-capelinha',
    title: 'Roupeiro Capelinha com Espelho - Por apenas R$ 799,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/promocoes/slide-roupeiro-capelinha-desk.webp',
    mobileSrc: '/images/promocoes/oferta-roupeiro-capelinha.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 33% • OFERTA RELÂMPAGO',
    category: 'Móveis para Quarto',
    productName: 'Roupeiro Capelinha com Espelho',
    oldPrice: 'De: R$ 1.195,00',
    newPrice: 'R$ 799,90',
    installments: 'ou 10x de R$ 101,58 nos cartões',
    zapMsg: 'Olá! Tenho interesse na oferta do Roupeiro Capelinha com Espelho por R$ 799,90 na Arruda Móveis.',
  },
  {
    id: 'tv-32',
    title: 'Smart TV 32" AOC / SEMP - Por apenas R$ 999,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/promocoes/slide-tv-32-desk.webp',
    mobileSrc: '/images/promocoes/oferta-tv-32.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 41% • OFERTA RELÂMPAGO',
    category: 'TV, Áudio & Vídeo',
    productName: 'Smart TV 32" AOC / SEMP',
    oldPrice: 'De: R$ 1.699,90',
    newPrice: 'R$ 999,90',
    installments: 'ou 10x de R$ 144,49 nos cartões',
    zapMsg: 'Olá! Tenho interesse na oferta da Smart TV 32" por R$ 999,90 na Arruda Móveis.',
  },
  {
    id: 'ventilador-mondial',
    title: 'Ventilador Mondial 40CM - Por apenas R$ 295,00',
    href: '#ofertas-relampago',
    desktopSrc: '/images/promocoes/slide-ventilador-mondial-desk.webp',
    mobileSrc: '/images/promocoes/oferta-ventilador-mondial.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 30% • OFERTA RELÂMPAGO',
    category: 'Ar & Ventilação',
    productName: 'Ventilador Mondial 40CM',
    oldPrice: 'De: R$ 420,00',
    newPrice: 'R$ 295,00',
    installments: 'ou 10x de R$ 35,70 nos cartões',
    zapMsg: 'Olá! Tenho interesse na oferta do Ventilador Mondial 40CM por R$ 295,00 na Arruda Móveis.',
  },
  {
    id: 'desconto-loja',
    title: 'Toda Loja com até 25% de Desconto - Oferta Relâmpago',
    href: '#ofertas-relampago',
    desktopSrc: '/images/promocoes/slide-desconto-loja-desk.webp',
    mobileSrc: '/images/promocoes/oferta-desconto-loja.webp',
    bgColor: '#090326',
    isOffer: true,
    badge: '⚡ CONDIÇÃO DO MÊS',
    category: 'Toda a Loja',
    productName: 'Até 25% de Desconto em Móveis e Eletros',
    oldPrice: 'Desconto à Vista',
    newPrice: 'Até 25% OFF',
    installments: 'Ou parcele em até 10x com 15% de desconto',
    zapMsg: 'Olá! Gostaria de consultar as condições de até 25% de desconto da campanha da Arruda Móveis.',
  },
  {
    id: 'mega-ofertas',
    title: 'Arruda Móveis - Mega Ofertas em Móveis e Eletros',
    href: '/catalogo',
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
      {activeBanner.isOffer ? (
        <>
          {/* Versão Desktop: 2 Colunas com Informações Grandes e Lâmina em Destaque */}
          <div className="hero-desktop-only">
            <div className="hero-split-banner">
              {/* Coluna 1: Informações da Oferta */}
              <div className="hero-split-info">
                {activeBanner.badge && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'var(--color-accent-highlight)',
                      color: 'var(--color-brand-primary)',
                      fontSize: '0.8125rem',
                      fontWeight: 900,
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      marginBottom: '1rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Sparkles size={14} /> {activeBanner.badge}
                  </span>
                )}

                {activeBanner.category && (
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: '#cbd5e1',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {activeBanner.category}
                  </span>
                )}

                <h2
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    lineHeight: 1.15,
                    marginBottom: '1.25rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {activeBanner.productName}
                </h2>

                {/* Preços De / Por */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {activeBanner.oldPrice && (
                    <span
                      style={{
                        fontSize: '1rem',
                        color: '#94a3b8',
                        textDecoration: 'line-through',
                        display: 'block',
                        marginBottom: '2px',
                      }}
                    >
                      {activeBanner.oldPrice}
                    </span>
                  )}

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
                        fontWeight: 900,
                        color: 'var(--color-accent-highlight)',
                        lineHeight: 1,
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      }}
                    >
                      {activeBanner.newPrice}
                    </span>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        backgroundColor: '#16a34a',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      à vista
                    </span>
                  </div>

                  {activeBanner.installments && (
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        color: '#e2e8f0',
                        fontWeight: 600,
                        display: 'block',
                        marginTop: '6px',
                      }}
                    >
                      {activeBanner.installments}
                    </span>
                  )}
                </div>

                {/* Botões de Ação */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href={getWhatsAppUrl(undefined, activeBanner.zapMsg || activeBanner.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hover"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      backgroundColor: 'var(--color-whatsapp)',
                      color: '#ffffff',
                      padding: '0.9rem 1.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      textDecoration: 'none',
                      boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    <MessageCircle size={22} />
                    <span>Garantir Oferta no WhatsApp</span>
                  </a>

                  <Link
                    href={activeBanner.href}
                    className="btn-hover"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.9rem 1.5rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '0.9375rem',
                      color: '#ffffff',
                      border: '2px solid rgba(255,255,255,0.3)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Ver Todas as Ofertas</span>
                  </Link>
                </div>
              </div>

              {/* Coluna 2: Imagem do Encarte em Alta Resolução */}
              <div className="hero-split-visual">
                <Link href={activeBanner.href}>
                  <img
                    src={activeBanner.mobileSrc}
                    alt={activeBanner.title}
                    className="hero-flyer-img"
                    loading="eager"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Versão Mobile: Imagem da lâmina completa na tela */}
          <div className="hero-mobile-only">
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
              <img
                src={activeBanner.mobileSrc}
                alt={activeBanner.title}
                loading="eager"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Link>
          </div>
        </>
      ) : (
        /* Banner Institucional Padrão Widescreen */
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
      )}

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
