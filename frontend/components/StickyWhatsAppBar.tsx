'use client';

import React from 'react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface StickyWhatsAppBarProps {
  productName: string;
  sku?: string;
  price: number;
  promoPrice?: number;
}

export default function StickyWhatsAppBar({
  productName,
  sku,
  price,
  promoPrice,
}: StickyWhatsAppBarProps) {
  const currentPrice = promoPrice && promoPrice < price ? promoPrice : price;
  const whatsappUrl = getWhatsAppUrl(productName, sku);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
        padding: '0.75rem 1rem',
      }}
      className="mobile-sticky-bar"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block' }}>
            Preço exclusivo:
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
            R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--color-whatsapp)',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9375rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '44px',
          }}
        >
          <span>Comprar pelo WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
