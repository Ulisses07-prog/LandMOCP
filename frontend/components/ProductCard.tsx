'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/catalog';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = product.images || [];
  const primaryImage = images.find((img) => img.is_primary) || images[0];
  const hasOffer = Boolean(product.promo_price && Number(product.promo_price) < Number(product.price));
  const currentPrice = hasOffer ? Number(product.promo_price) : Number(product.price);
  const originalPrice = Number(product.price);
  const discountPercent = product.offer?.discount_percent || (hasOffer ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  const whatsappUrl = getWhatsAppUrl(product.name, product.sku);

  return (
    <div
      className="card-hover"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Badges estilo Casas Bahia com cores da Arruda */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {hasOffer && (
          <span
            style={{
              backgroundColor: '#16a34a',
              color: '#ffffff',
              padding: '0.25rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 900,
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.4)',
              letterSpacing: '0.02em',
            }}
          >
            Baixou {discountPercent}%
          </span>
        )}
        {product.is_featured && !hasOffer && (
          <span
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-accent-highlight)',
              padding: '0.25rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              fontWeight: 900,
              border: '1px solid var(--color-accent-highlight)',
            }}
          >
            DESTAQUE
          </span>
        )}
      </div>

      {/* Badge de Disponibilidade (Estoque) */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 5 }}>
        {product.availability === 'Pronta Entrega' || (product.stock && product.stock > 0) ? (
          <span
            style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              border: '1px solid #86efac',
              padding: '0.25rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
            Pronta Entrega
          </span>
        ) : (
          <span
            style={{
              backgroundColor: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '0.25rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            📦 Sob Encomenda
          </span>
        )}
      </div>

      {/* Imagem do Produto */}
      <Link
        href={`/produto/${product.slug}`}
        style={{
          display: 'block',
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#f1f5f9',
          overflow: 'hidden',
        }}
      >
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            ARRUDA MÓVEIS
          </div>
        )}
      </Link>

      {/* Detalhes e Conversão */}
      <div style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          {product.brand || 'Arruda Móveis'}
        </span>

        <Link href={`/produto/${product.slug}`}>
          <h3
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--color-brand-primary)',
              lineHeight: 1.4,
              marginBottom: '0.85rem',
              minHeight: '2.7rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Bloco de Preço Estilo Casas Bahia */}
        <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
          {hasOffer && (
            <span
              style={{
                fontSize: '0.8125rem',
                color: '#94a3b8',
                textDecoration: 'line-through',
                display: 'block',
              }}
            >
              R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-brand-primary)' }}>
              R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
              no PIX
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
            ou até <strong>10x de R$ {(currentPrice / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> sem juros
          </span>
        </div>

        {/* Botão de WhatsApp */}
        <a
          href={whatsappUrl}
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
          }}
        >
          <span>Comprar via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
