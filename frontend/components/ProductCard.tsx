'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/catalog';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const hasOffer = Boolean(product.promo_price && product.promo_price < product.price);
  const currentPrice = hasOffer ? Number(product.promo_price) : Number(product.price);
  const originalPrice = Number(product.price);
  const discountPercent = product.offer?.discount_percent || (hasOffer ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  const whatsappUrl = getWhatsAppUrl(product.name, product.sku);

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        position: 'relative',
      }}
      className="product-card"
    >
      {/* Badges de Oferta / Destaque */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '6px' }}>
        {hasOffer && (
          <span
            style={{
              backgroundColor: 'var(--color-accent-highlight)',
              color: 'var(--color-brand-primary)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 800,
            }}
          >
            -{discountPercent}% OFF
          </span>
        )}
        {product.is_featured && !hasOffer && (
          <span
            style={{
              backgroundColor: 'var(--color-brand-accent)',
              color: '#ffffff',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            DESTAQUE
          </span>
        )}
      </div>

      {/* Imagem do Produto */}
      <Link href={`/produto/${product.slug}`} style={{ display: 'block', position: 'relative', width: '100%', aspectRatio: '1 / 1', backgroundColor: '#f8fafc' }}>
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-normal)',
            }}
            className="product-img"
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
              fontWeight: 500,
            }}
          >
            Foto em breve
          </div>
        )}
      </Link>

      {/* Informações e Preço */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
          {product.brand || 'Arruda Móveis'}
        </span>

        <Link href={`/produto/${product.slug}`}>
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.35,
              marginBottom: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5rem',
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Bloco de Preço */}
        <div style={{ marginTop: 'auto', marginBottom: '0.875rem' }}>
          {hasOffer && (
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                textDecoration: 'line-through',
                display: 'block',
              }}
            >
              R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: hasOffer ? 'var(--color-brand-primary)' : 'var(--color-text-primary)' }}>
              R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {product.payment_condition && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
              {product.payment_condition}
            </span>
          )}
        </div>

        {/* Botão de Ação Direta no WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-whatsapp)',
            color: '#ffffff',
            padding: '0.625rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.875rem',
            textAlign: 'center',
            transition: 'background-color var(--transition-fast)',
            minHeight: '44px',
          }}
          className="whatsapp-btn"
        >
          <span>Tenho Interesse</span>
        </a>
      </div>
    </div>
  );
}
