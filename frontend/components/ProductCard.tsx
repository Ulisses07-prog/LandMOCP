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
      {/* Badges */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5, display: 'flex', gap: '6px' }}>
        {hasOffer && (
          <span
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 800,
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
            }}
          >
            -{discountPercent}% OFF
          </span>
        )}
        {product.is_featured && !hasOffer && (
          <span
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-accent-highlight)',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: '1px solid var(--color-accent-highlight)',
            }}
          >
            DESTAQUE
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

        {/* Bloco de Preço */}
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-brand-primary)' }}>
              R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {product.payment_condition && (
            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'block', marginTop: '2px' }}>
              💳 {product.payment_condition}
            </span>
          )}
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
