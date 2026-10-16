'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function WhatsAppFloat() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <aside
      aria-label="Atendimento Comercial WhatsApp"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#22c55e',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-full)',
          fontWeight: 800,
          fontSize: '0.9375rem',
          boxShadow: '0 8px 24px rgba(34, 197, 94, 0.45)',
          border: '2px solid #ffffff',
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MessageCircle size={22} fill="#ffffff" color="#22c55e" />
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              backgroundColor: '#fef826',
              borderRadius: '50%',
              border: '1px solid #22c55e',
            }}
          />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span>Falar com Vendedor</span>
          <span style={{ fontSize: '0.6875rem', opacity: 0.9, fontWeight: 600 }}>Online Agora</span>
        </span>
      </a>
    </aside>
  );
}
