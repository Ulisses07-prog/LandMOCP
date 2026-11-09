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

const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: 'aniversario-arruda-33',
    title: 'Arruda Móveis - Aniversário 33 Anos (01 a 30 de Novembro)',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-01-aniversario-arruda.webp',
    mobileSrc: '/images/banners/banner-01-aniversario-arruda.webp',
    bgColor: '#090326',
    isOffer: true,
    badge: '🎉 ANIVERSÁRIO 33 ANOS ARRUDA MÓVEIS',
    category: 'Válido de 01 a 30 de Novembro em todas as 8 Lojas',
    productName: 'O aniversário é nosso, o presente é para você!',
    oldPrice: 'Vários Prêmios e Sorteios',
    newPrice: 'Ofertas Imperdíveis',
    installments: 'Parcele em até 10x nos cartões com descontos exclusivos',
    zapMsg: 'Olá! Vi a campanha de Aniversário de 33 Anos no site da Arruda Móveis e quero consultar as ofertas e sorteios.',
  },
  {
    id: 'aniversario-premios',
    title: 'Arruda Móveis - Sorteios e Prêmios de Aniversário',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-02-aniversario-premios.webp',
    mobileSrc: '/images/banners/banner-02-aniversario-premios.webp',
    bgColor: '#090326',
    isOffer: true,
    badge: '🎁 SORTEIOS DE ANIVERSÁRIO',
    category: 'Móveis & Eletros com Prêmios no PIX',
    productName: 'Compre e Concorra a Diversos Prêmios',
    oldPrice: 'Campanha de Novembro',
    newPrice: 'Prêmios + PIX',
    installments: 'Consulte o regulamento com os vendedores da sua cidade',
    zapMsg: 'Olá! Gostaria de saber mais sobre os sorteios de Aniversário das Lojas Arruda Móveis.',
  },
  {
    id: 'banner-ar-condicionado',
    title: 'Ar-Condicionado Elgin/Philco 9000 BTUs - Por apenas R$ 2.499,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-ar-condicionado.webp',
    mobileSrc: '/images/promocoes/oferta-ar-condicionado.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU R$ 675 • ANIVERSÁRIO 33 ANOS',
    category: 'Climatização',
    productName: 'Ar-Condicionado Elgin/Philco 9000 BTUs',
    oldPrice: 'De: R$ 3.175,00',
    newPrice: 'R$ 2.499,90',
    installments: 'ou 10x de R$ 269,88 nos cartões',
    zapMsg: 'Olá! Tenho interesse no Ar-Condicionado Elgin/Philco 9000 BTUs por R$ 2.499,90 na promoção de Aniversário da Arruda Móveis.',
  },
  {
    id: 'banner-refrigerador-consul',
    title: 'Refrigerador Consul 2 Portas 332L CRD37 - Por apenas R$ 2.899,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-refrigerador-consul.webp',
    mobileSrc: '/images/promocoes/oferta-refrigerador-consul.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU R$ 1.100 • ANIVERSÁRIO 33 ANOS',
    category: 'Eletrodomésticos',
    productName: 'Refrigerador Consul 2 Portas 332L CRD37',
    oldPrice: 'De: R$ 3.999,90',
    newPrice: 'R$ 2.899,90',
    installments: 'ou 10x de R$ 339,99 nos cartões',
    zapMsg: 'Olá! Tenho interesse no Refrigerador Consul 332L CRD37 por R$ 2.899,90 na promoção de Aniversário da Arruda Móveis.',
  },
  {
    id: 'banner-tv-32',
    title: 'Smart TV 32" AOC / SEMP - Por apenas R$ 999,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-tv-32.webp',
    mobileSrc: '/images/promocoes/oferta-tv-32.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 41% • ANIVERSÁRIO 33 ANOS',
    category: 'TV, Áudio & Vídeo',
    productName: 'Smart TV 32" AOC / SEMP',
    oldPrice: 'De: R$ 1.699,90',
    newPrice: 'R$ 999,90',
    installments: 'ou 10x de R$ 144,49 nos cartões',
    zapMsg: 'Olá! Tenho interesse na Smart TV 32" por R$ 999,90 na promoção de Aniversário da Arruda Móveis.',
  },
  {
    id: 'banner-kit-telasul',
    title: 'Kit Telasul Diamante 6 Portas - Por apenas R$ 899,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-kit-telasul.webp',
    mobileSrc: '/images/promocoes/oferta-kit-telasul.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ COZINHA DE AÇO • ANIVERSÁRIO 33 ANOS',
    category: 'Móveis para Cozinha',
    productName: 'Kit Telasul Diamante 6 Portas',
    oldPrice: 'De: R$ 1.280,00',
    newPrice: 'R$ 899,90',
    installments: 'ou 10x de R$ 108,57 nos cartões',
    zapMsg: 'Olá! Tenho interesse no Kit Telasul Diamante 6 Portas por R$ 899,90 na Arruda Móveis.',
  },
  {
    id: 'banner-roupeiro-capelinha',
    title: 'Roupeiro Capelinha BS07 - Por apenas R$ 799,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-roupeiro-capelinha.webp',
    mobileSrc: '/images/promocoes/oferta-roupeiro-capelinha.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 33% • ANIVERSÁRIO 33 ANOS',
    category: 'Móveis para Quarto',
    productName: 'Roupeiro Capelinha BS07 com Espelho',
    oldPrice: 'De: R$ 1.195,00',
    newPrice: 'R$ 799,90',
    installments: 'ou 10x de R$ 101,58 nos cartões',
    zapMsg: 'Olá! Tenho interesse no Roupeiro Capelinha BS07 por R$ 799,90 na Arruda Móveis.',
  },
  {
    id: 'banner-fogao-realce',
    title: 'Fogão Realce 4 BC Xodó - Por apenas R$ 679,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-fogao-realce.webp',
    mobileSrc: '/images/promocoes/oferta-fogao-realce.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 30% • ANIVERSÁRIO 33 ANOS',
    category: 'Fogões & Cozinha',
    productName: 'Fogão Realce 4 BC Xodó',
    oldPrice: 'De: R$ 965,00',
    newPrice: 'R$ 679,90',
    installments: 'ou 10x de R$ 82,03 nos cartões',
    zapMsg: 'Olá! Tenho interesse no Fogão Realce 4 BC por R$ 679,90 na Arruda Móveis.',
  },
  {
    id: 'banner-lavadora-wanke',
    title: 'Lavadora Wanke 10KG - Por apenas R$ 555,00',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-lavadora-wanke.webp',
    mobileSrc: '/images/promocoes/oferta-lavadora-wanke.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ BAIXOU 33% • ANIVERSÁRIO 33 ANOS',
    category: 'Lavadoras & Área de Serviço',
    productName: 'Lavadora Wanke 10KG',
    oldPrice: 'De: R$ 825,00',
    newPrice: 'R$ 555,00',
    installments: 'ou 10x de R$ 70,13 nos cartões',
    zapMsg: 'Olá! Tenho interesse na Lavadora Wanke 10KG por R$ 555,00 na Arruda Móveis.',
  },
  {
    id: 'banner-rack-camille',
    title: 'Rack Tuboart Camille - Por apenas R$ 499,90',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-rack-camille.webp',
    mobileSrc: '/images/promocoes/oferta-rack-camille.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ SALA MODERNA • ANIVERSÁRIO 33 ANOS',
    category: 'Móveis para Sala',
    productName: 'Rack Tuboart Camille',
    oldPrice: 'De: R$ 699,90',
    newPrice: 'R$ 499,90',
    installments: 'ou 10x de R$ 59,49 nos cartões',
    zapMsg: 'Olá! Tenho interesse no Rack Tuboart Camille por R$ 499,90 na Arruda Móveis.',
  },
  {
    id: 'banner-ventilador-coluna',
    title: 'Ventilador Mondial Coluna 40CM VSP40 - Por apenas R$ 295,00',
    href: '#ofertas-relampago',
    desktopSrc: '/images/banners/banner-ventilador-coluna.webp',
    mobileSrc: '/images/promocoes/oferta-ventilador-coluna.webp',
    bgColor: '#0f0345',
    isOffer: true,
    badge: '⚡ MAIS VENTO • ANIVERSÁRIO 33 ANOS',
    category: 'Ar & Ventilação',
    productName: 'Ventilador Mondial Coluna 40CM VSP40',
    oldPrice: 'De: R$ 420,00',
    newPrice: 'R$ 295,00',
    installments: 'ou 10x de R$ 35,70 nos cartões',
    zapMsg: 'Olá! Tenho interesse no Ventilador Mondial Coluna 40CM por R$ 295,00 na Arruda Móveis.',
  },
];

export default function HeroBannerSlider() {
  const [banners, setBanners] = useState<BannerSlide[]>(DEFAULT_BANNERS);
  const [current, setCurrent] = useState(0);

  // Busca banners dinâmicos colocados na pasta public/images/banners
  useEffect(() => {
    fetch('/api/banners')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.banners && data.banners.length > 0) {
          setBanners([...data.banners, ...DEFAULT_BANNERS]);
        }
      })
      .catch(() => {});
  }, []);

  // Troca automática a cada 6 segundos
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const activeBanner = banners[current] || banners[0];

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
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            aria-label="Banner anterior"
            className="btn-hover banner-nav-btn banner-nav-prev"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
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
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            aria-label="Próximo banner"
            className="btn-hover banner-nav-btn banner-nav-next"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '36px',
              height: '36px',
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
            <ChevronRight size={20} />
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
            {banners.map((b, idx) => (
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
