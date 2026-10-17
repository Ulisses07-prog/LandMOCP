'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useStore } from '@/contexts/StoreContext';
import { MapPin, ChevronDown } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const { selectedStore, storeWhatsAppNumber, openStoreModal } = useStore();
  
  const whatsappUrl = getWhatsAppUrl(undefined, undefined, undefined, storeWhatsAppNumber, selectedStore?.name);

  return (
    <>
      {/* Barra de Aviso Superior Comercial */}
      <div
        className="announcement-bar"
        style={{
          backgroundColor: 'var(--color-accent-highlight)',
          color: 'var(--color-brand-primary)',
          fontSize: '0.8125rem',
          fontWeight: 800,
          textAlign: 'center',
          padding: '0.4rem 1rem',
          letterSpacing: '0.03em',
        }}
      >
        ⚡ SUPER OFERTAS DE INAUGURAÇÃO • ATENDIMENTO PELO WHATSAPP • PARCELAMENTO EM ATÉ 10X
      </div>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-brand-primary)',
          boxShadow: '0 4px 12px rgba(15, 3, 69, 0.25)',
          borderBottom: '2px solid rgba(254, 248, 38, 0.2)',
          width: '100%',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            gap: '0.5rem',
          }}
        >
          {/* Logo Oficial */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img
                src="/images/logo-arruda.webp"
                alt="Arruda Móveis Eletro"
                style={{
                  height: '38px',
                  width: 'auto',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(254, 248, 38, 0.4)',
                  backgroundColor: '#ffffff',
                  padding: '2px',
                }}
              />
              <div>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    display: 'block',
                    color: '#ffffff',
                    lineHeight: 1.1,
                  }}
                >
                  ARRUDA
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: 'var(--color-accent-highlight)',
                    letterSpacing: '0.08em',
                    display: 'block',
                  }}
                >
                  MÓVEIS ELETRO
                </span>
              </div>
            </Link>

            {/* Seletor de Loja Desktop */}
            {selectedStore && (
              <div className="hide-mobile" style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: '1px solid rgba(254, 248, 38, 0.35)',
                    cursor: 'pointer',
                  }}
                  title={selectedStore.name}
                >
                  <MapPin size={13} style={{ flexShrink: 0, color: 'var(--color-accent-highlight)' }} />
                  <span>{selectedStore.name}</span>
                  <ChevronDown size={13} style={{ flexShrink: 0 }} />
                </button>

                {storeDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '0.5rem',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                      padding: '0.5rem',
                      minWidth: '200px',
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Loja Selecionada
                    </div>
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ color: '#22c55e' }}>●</span>
                      {selectedStore.name} ({selectedStore.type})
                    </div>
                    <div
                      style={{
                        borderTop: '1px solid #e2e8f0',
                        marginTop: '0.5rem',
                        paddingTop: '0.5rem',
                      }}
                    >
                      <button
                        onClick={() => {
                          setStoreDropdownOpen(false);
                          openStoreModal();
                        }}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f1f5f9',
                          color: 'var(--color-brand-primary)',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'center',
                          borderRadius: '6px',
                        }}
                      >
                        Trocar loja
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navegação Desktop */}
          <nav className="nav-desktop">
            <Link
              href="/"
              style={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9375rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Início
            </Link>
            <Link
              href="/catalogo"
              style={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9375rem',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              Catálogo Completo
            </Link>
            <Link
              href="/ofertas"
              style={{
                backgroundColor: 'rgba(254, 248, 38, 0.15)',
                color: 'var(--color-accent-highlight)',
                fontWeight: 800,
                fontSize: '0.9375rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(254, 248, 38, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>🔥 OFERTAS</span>
            </Link>
          </nav>

          {/* Ações Desktop: WhatsApp */}
          <div className="header-desktop-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover"
              title="Fale no WhatsApp"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--color-whatsapp)',
                color: '#ffffff',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.8125rem',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
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
              <span>Fale no WhatsApp</span>
            </a>
          </div>

          {/* Botão Hambúrguer Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menu"
            className="nav-mobile-btn"
            style={{
              padding: '8px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ width: '22px', height: '2.5px', backgroundColor: '#ffffff', borderRadius: '2px', display: 'block' }} />
              <span style={{ width: '22px', height: '2.5px', backgroundColor: '#ffffff', borderRadius: '2px', display: 'block' }} />
              <span style={{ width: '22px', height: '2.5px', backgroundColor: '#ffffff', borderRadius: '2px', display: 'block' }} />
            </div>
          </button>
        </div>

        {/* Sub-barra Mobile: Balão de WhatsApp Centralizado e Seletor de Loja */}
        <div className="header-mobile-subbar">
          {selectedStore && (
            <button
              onClick={openStoreModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid rgba(254, 248, 38, 0.35)',
                maxWidth: '160px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <MapPin size={13} style={{ flexShrink: 0, color: 'var(--color-accent-highlight)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedStore.city || selectedStore.name}
              </span>
              <ChevronDown size={13} style={{ flexShrink: 0 }} />
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--color-whatsapp)',
              color: '#ffffff',
              padding: '0.42rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.8125rem',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              textDecoration: 'none',
              flexShrink: 0,
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
            <span>WhatsApp Arruda</span>
          </a>
        </div>

        {/* Menu Retrátil Mobile */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-brand-secondary)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#ffffff', fontWeight: 600, padding: '0.5rem 0' }}
            >
              Início
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#ffffff', fontWeight: 600, padding: '0.5rem 0' }}
            >
              Catálogo Completo
            </Link>
            <Link
              href="/ofertas"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--color-accent-highlight)',
                fontWeight: 700,
                padding: '0.5rem 0',
              }}
            >
              🔥 Ofertas da Semana
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
