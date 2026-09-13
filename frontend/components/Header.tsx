'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappUrl = getWhatsAppUrl();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--color-brand-primary)',
        color: 'var(--color-text-inverse)',
        boxShadow: 'var(--shadow-md)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.875rem',
          paddingBottom: '0.875rem',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img
            src="/images/logo-arruda.webp"
            alt="Arruda Móveis Eletro"
            style={{
              height: '44px',
              width: 'auto',
              maxHeight: '44px',
              borderRadius: 'var(--radius-sm)',
              objectFit: 'contain',
            }}
          />
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', display: 'block', color: 'var(--color-text-inverse)' }}>
              ARRUDA
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--color-accent-highlight)',
                letterSpacing: '0.05em',
                display: 'block',
              }}
            >
              MÓVEIS ELETRO
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav
          style={{
            display: 'none',
            gap: '1.5rem',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          <Link href="/" style={{ fontWeight: 500, transition: 'color 150ms' }}>
            Início
          </Link>
          <Link href="/catalogo" style={{ fontWeight: 500, transition: 'color 150ms' }}>
            Catálogo Completo
          </Link>
          <Link
            href="/ofertas"
            style={{
              fontWeight: 700,
              color: 'var(--color-accent-highlight)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span>🔥 Ofertas</span>
          </Link>
        </nav>

        {/* Botão de Ação Direta WhatsApp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-whatsapp)',
              color: '#ffffff',
              padding: '0.5rem 1.125rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'inline-block',
              }}
            />
            <span>WhatsApp</span>
          </a>

          {/* Botão Hambúrguer Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '8px',
              color: '#ffffff',
            }}
            className="mobile-toggle"
          >
            <span style={{ width: '22px', height: '2px', backgroundColor: '#ffffff', display: 'block' }} />
            <span style={{ width: '22px', height: '2px', backgroundColor: '#ffffff', display: 'block' }} />
            <span style={{ width: '22px', height: '2px', backgroundColor: '#ffffff', display: 'block' }} />
          </button>
        </div>
      </div>

      {/* Gaveta Mobile */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-brand-secondary)',
            padding: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            Início
          </Link>
          <Link href="/catalogo" onClick={() => setMobileMenuOpen(false)}>
            Catálogo Completo
          </Link>
          <Link
            href="/ofertas"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--color-accent-highlight)', fontWeight: 700 }}
          >
            🔥 Ofertas da Semana
          </Link>
        </div>
      )}
    </header>
  );
}
