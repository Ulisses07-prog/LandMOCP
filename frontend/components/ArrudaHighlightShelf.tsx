'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/catalog';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useStore } from '@/contexts/StoreContext';
import { Flame, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ArrudaHighlightShelfProps {
  products: Product[];
}

export default function ArrudaHighlightShelf({ products }: ArrudaHighlightShelfProps) {
  const { selectedStore, storeWhatsAppNumber } = useStore();

  // Filtrar até 4 ou 6 produtos mais atrativos com oferta ou pronta entrega
  const displayProducts = products && products.length > 0 
    ? products.slice(0, 4) 
    : [];

  if (displayProducts.length === 0) return null;

  return (
    <section style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #090326 0%, #0f0345 50%, #17075c 100%)',
            borderRadius: '16px',
            border: '2px solid var(--color-accent-highlight)',
            boxShadow: '0 12px 36px rgba(15, 3, 69, 0.22)',
            padding: '2.25rem 1.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decoração sutil de luz de fundo */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(254, 248, 38, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Cabeçalho da Prateleira */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-accent-highlight)',
                  color: 'var(--color-brand-primary)',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.04em',
                }}
              >
                <Flame size={14} fill="var(--color-brand-primary)" />
                <span>SUPER SELEÇÃO ARRUDA</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Ofertas da Semana com Entrega Imediata
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
                Aproveite preços especiais negociados direto com o fabricante
              </p>
            </div>

            <Link
              href="/ofertas"
              className="btn-hover"
              style={{
                backgroundColor: 'rgba(254, 248, 38, 0.15)',
                color: 'var(--color-accent-highlight)',
                border: '1px solid var(--color-accent-highlight)',
                padding: '0.5rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
              }}
            >
              <span>Ver todas as ofertas</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Grid dos Cards de Oferta na Prateleira */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {displayProducts.map((product) => {
              const imageSrc =
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : '/images/mock-sofa.webp';

              const priceNum = Number(product.price);
              const promoNum = product.promo_price ? Number(product.promo_price) : null;
              const hasDiscount = promoNum && promoNum < priceNum;
              const currentPrice = hasDiscount ? promoNum : priceNum;

              const whatsappUrl = getWhatsAppUrl(
                product.name,
                product.sku,
                'Super Seleção Arruda',
                storeWhatsAppNumber,
                selectedStore?.name
              );

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    transition: 'transform 0.2s ease',
                  }}
                  className="card-hover"
                >
                  {/* Foto do Produto com Badge de Pronta Entrega */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#f8fafc', padding: '0.75rem' }}>
                    <img
                      src={imageSrc}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      loading="lazy"
                    />

                    {product.availability === 'Pronta Entrega' && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <CheckCircle2 size={11} /> Pronta Entrega
                      </span>
                    )}

                    {hasDiscount && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        OFERTA
                      </span>
                    )}
                  </div>

                  {/* Detalhes do Produto */}
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                        {product.brand || 'Arruda Móveis'}
                      </span>
                      <h3
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 800,
                          color: 'var(--color-brand-primary)',
                          lineHeight: 1.3,
                          margin: '3px 0 8px 0',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '2.4em',
                        }}
                      >
                        {product.name}
                      </h3>

                      {/* Bloco de Preço */}
                      <div style={{ margin: '0.5rem 0' }}>
                        {hasDiscount && product.old_price && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through', display: 'block' }}>
                            R$ {Number(product.old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-brand-primary)', display: 'block' }}>
                          R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                          10x de R$ {(currentPrice / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </span>
                      </div>
                    </div>

                    {/* Botão de Fechar no WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hover"
                      style={{
                        backgroundColor: 'var(--color-whatsapp)',
                        color: '#ffffff',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        textAlign: 'center',
                        textDecoration: 'none',
                        marginTop: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span>Garantir pelo WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
