'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap, Clock, MapPin, ArrowRight, MessageCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useStore } from '@/contexts/StoreContext';

export interface OfficialOfferItem {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  promoPrice: number;
  installments: string;
  discountPercent: number;
  image: string;
}

export const OFERTAS_MENSAIS: OfficialOfferItem[] = [
  {
    id: 'fogao-realce',
    name: 'Fogão Realce 4 BC Xodó',
    category: 'Fogões & Cozinha',
    originalPrice: 965.0,
    promoPrice: 679.9,
    installments: '10x de R$ 82,03 nos cartões',
    discountPercent: 30,
    image: '/images/promocoes/oferta-fogao-realce.webp',
  },
  {
    id: 'lavadora-wanke',
    name: 'Lavadora Wanke 10KG',
    category: 'Lavadoras & Área de Serviço',
    originalPrice: 825.0,
    promoPrice: 555.0,
    installments: '10x de R$ 70,13 nos cartões',
    discountPercent: 33,
    image: '/images/promocoes/oferta-lavadora-wanke.webp',
  },
  {
    id: 'roupeiro-capelinha',
    name: 'Roupeiro Capelinha com Espelho',
    category: 'Móveis para Quarto',
    originalPrice: 1195.0,
    promoPrice: 799.9,
    installments: '10x de R$ 101,58 nos cartões',
    discountPercent: 33,
    image: '/images/promocoes/oferta-roupeiro-capelinha.webp',
  },
  {
    id: 'tv-32',
    name: 'Smart TV 32" AOC / SEMP',
    category: 'TV, Áudio & Vídeo',
    originalPrice: 1699.9,
    promoPrice: 999.9,
    installments: '10x de R$ 144,49 nos cartões',
    discountPercent: 41,
    image: '/images/promocoes/oferta-tv-32.webp',
  },
  {
    id: 'ventilador-mondial',
    name: 'Ventilador Mondial 40CM',
    category: 'Ar & Ventilação',
    originalPrice: 420.0,
    promoPrice: 295.0,
    installments: '10x de R$ 35,70 nos cartões',
    discountPercent: 30,
    image: '/images/promocoes/oferta-ventilador-mondial.webp',
  },
];

export default function FlashOffers() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const { selectedStore, storeWhatsAppNumber } = useStore();
  const whatsappNumber = storeWhatsAppNumber;

  const [timeLeft, setTimeLeft] = useState({
    hours: 48,
    minutes: 30,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="ofertas-relampago"
      style={{
        padding: '3.5rem 0',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div className="container">
        {/* Cabeçalho da Seção de Ofertas */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-accent-highlight)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(15, 3, 69, 0.2)',
                }}
              >
                <Zap size={24} fill="var(--color-accent-highlight)" />
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)',
                  fontWeight: 900,
                  color: 'var(--color-brand-primary)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Ofertas Relâmpago
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#fef08a',
                  color: '#854d0e',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <Sparkles size={12} /> VÁLIDAS DE 19 A 21 DE OUTUBRO
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                <MapPin size={14} color="#dc2626" /> Lojas Esperantina e Batalha • Ou até durarem os estoques
              </span>
            </div>
          </div>

          {/* Cronômetro Regressivo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} color="var(--color-brand-primary)" /> Encerra em:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-accent-highlight)',
                  fontWeight: 900,
                  fontSize: '0.9375rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  minWidth: '38px',
                  textAlign: 'center',
                }}
              >
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span style={{ fontWeight: 900, color: 'var(--color-brand-primary)' }}>:</span>
              <span
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-accent-highlight)',
                  fontWeight: 900,
                  fontSize: '0.9375rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  minWidth: '38px',
                  textAlign: 'center',
                }}
              >
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span style={{ fontWeight: 900, color: 'var(--color-brand-primary)' }}>:</span>
              <span
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-accent-highlight)',
                  fontWeight: 900,
                  fontSize: '0.9375rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  minWidth: '38px',
                  textAlign: 'center',
                }}
              >
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Lâmina Especial de Toda Loja em Destaque */}
        <div
          style={{
            backgroundColor: '#0f0345',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            color: '#ffffff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
            border: '2px solid var(--color-accent-highlight)',
            boxShadow: '0 6px 20px rgba(15, 3, 69, 0.15)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-accent-highlight)', letterSpacing: '0.06em' }}>
              CONDIÇÃO ESPECIAL DO MÊS
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: '2px 0 4px 0' }}>
              TODA A LOJA COM ATÉ <span style={{ color: 'var(--color-accent-highlight)' }}>25% DE DESCONTO</span>
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>
              Ou parcele em até <strong>10x com 15% de desconto</strong>. Consulte condições com nossos vendedores.
            </p>
          </div>
          <a
            href={getWhatsAppUrl(undefined, undefined, undefined, whatsappNumber, selectedStore?.name, 'Olá! Gostaria de consultar as condições de até 25% de desconto da campanha da Arruda Móveis.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hover"
            style={{
              backgroundColor: 'var(--color-whatsapp)',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
            }}
          >
            <MessageCircle size={18} />
            <span>Consultar no WhatsApp</span>
          </a>
        </div>

        {/* Controles de Navegação do Carrossel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--color-brand-primary)" />
            Deslize para o lado para conferir todos os produtos em oferta
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => scrollCarousel('left')}
              aria-label="Voltar ofertas"
              className="btn-hover"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: 'var(--color-brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              aria-label="Avançar ofertas"
              className="btn-hover"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-primary)',
                border: 'none',
                color: 'var(--color-accent-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(15, 3, 69, 0.25)',
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carrossel Deslizante de Ofertas Relâmpago */}
        <div ref={carouselRef} className="offers-carousel-track">
          {/* Card 1: Encarte Oficial de Capa */}
          <div
            className="offers-carousel-card card-hover"
            style={{
              backgroundColor: '#0f0345',
              border: '2px solid var(--color-accent-highlight)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(15, 3, 69, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              color: '#ffffff',
            }}
          >
            <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
              <span
                style={{
                  backgroundColor: 'var(--color-accent-highlight)',
                  color: '#0f0345',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                }}
              >
                ENCARTE OFICIAL
              </span>
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '9 / 16',
                maxHeight: '340px',
                backgroundColor: '#180766',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/images/promocoes/oferta-capa-relampago.webp"
                alt="Encarte Oficial de Ofertas Relâmpago"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-highlight)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Edição Especial
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.35, marginBottom: '0.75rem', minHeight: '2.7rem' }}>
                Ofertas Relâmpago Arruda Móveis (19 a 21 de Outubro)
              </h3>
              <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#93c5fd', display: 'block', fontWeight: 700 }}>
                  Esperantina e Batalha - PI
                </span>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block', marginTop: '2px' }}>
                  Preços imperdíveis direto da fábrica
                </span>
              </div>
              <a
                href={getWhatsAppUrl(undefined, undefined, undefined, whatsappNumber, selectedStore?.name, 'Olá! Vi o encarte oficial das Ofertas Relâmpago e quero saber mais!')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-accent-highlight)',
                  color: '#0f0345',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 900,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={18} />
                <span>Pedir no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: Lâmina de Toda a Loja com até 25% de Desconto */}
          <div
            className="offers-carousel-card card-hover"
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
              <div className="arruda-promo-balloon" title="Aproveite! Até 25% de desconto à vista">
                <span className="arruda-promo-balloon__top">ATÉ</span>
                <div className="arruda-promo-balloon__percent">
                  25<span>%</span>
                </div>
                <span className="arruda-promo-balloon__bottom">OFF</span>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '9 / 16',
                maxHeight: '340px',
                backgroundColor: '#f8fafc',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/images/promocoes/oferta-desconto-loja.webp"
                alt="Toda Loja com até 25% de Desconto"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Condição Especial
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-primary)', lineHeight: 1.35, marginBottom: '0.75rem', minHeight: '2.7rem' }}>
                Toda a Loja com até 25% de Desconto à Vista
              </h3>
              <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#16a34a', display: 'block', fontWeight: 800 }}>
                  Ou até 10x com 15% de desconto
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
                  Nos principais cartões de crédito
                </span>
              </div>
              <a
                href={getWhatsAppUrl(undefined, undefined, undefined, whatsappNumber, selectedStore?.name, 'Olá! Gostaria de consultar as condições de até 25% de desconto na Arruda Móveis.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-whatsapp)',
                  color: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={18} />
                <span>Consultar no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Cards 3 a 7: Itens Oficiais da Promoção Mensal */}
          {OFERTAS_MENSAIS.map((item) => {
            const itemZapUrl = getWhatsAppUrl(
              item.name,
              item.id,
              `Olá! Tenho interesse na Oferta Relâmpago do ${item.name} por R$ ${item.promoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} na Arruda Móveis.`,
              whatsappNumber,
              selectedStore?.name
            );

            return (
              <div
                key={item.id}
                className="offers-carousel-card card-hover"
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* Balão Promocional Dinâmico Animado Arruda Móveis */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                  <div className="arruda-promo-balloon" title={`Aproveite! ${item.discountPercent}% de desconto`}>
                    <span className="arruda-promo-balloon__top">ATÉ</span>
                    <div className="arruda-promo-balloon__percent">
                      {item.discountPercent}<span>%</span>
                    </div>
                    <span className="arruda-promo-balloon__bottom">OFF</span>
                  </div>
                </div>

                {/* Imagem Oficial da Lâmina */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9 / 16',
                    maxHeight: '340px',
                    backgroundColor: '#f8fafc',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                </div>

                {/* Informações de Preço e Ação */}
                <div style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {item.category}
                  </span>

                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: 'var(--color-brand-primary)',
                      lineHeight: 1.35,
                      marginBottom: '0.75rem',
                      minHeight: '2.7rem',
                    }}
                  >
                    {item.name}
                  </h3>

                  {/* Preço De / Por */}
                  <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#94a3b8',
                        textDecoration: 'line-through',
                        display: 'block',
                      }}
                    >
                      De: R$ {item.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-brand-primary)' }}>
                        R$ {item.promoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                        à vista
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '3px' }}>
                      ou <strong>{item.installments}</strong>
                    </span>
                  </div>

                  {/* Botão de Compra no WhatsApp */}
                  <a
                    href={itemZapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'var(--color-whatsapp)',
                      color: '#ffffff',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                      textDecoration: 'none',
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>Garantir Oferta no WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé com Link para todo o Catálogo */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            href="/catalogo"
            className="btn-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-accent-highlight)',
              padding: '0.85rem 2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.9375rem',
              boxShadow: '0 4px 14px rgba(15, 3, 69, 0.25)',
              textDecoration: 'none',
            }}
          >
            <span>Ver Catálogo Completo da Loja</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
