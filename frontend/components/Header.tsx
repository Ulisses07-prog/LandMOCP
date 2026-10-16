'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useStore } from '@/contexts/StoreContext';
import { MapPin, ChevronDown } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const { selectedStore, selectedSalesperson, getNextSalesperson } = useStore();
  
  // Usar WhatsApp do vendedor se disponível, senão da loja, senão padrão
  const whatsappNumber = selectedSalesperson?.whatsapp_number || selectedStore?.whatsapp_number;
  const whatsappUrl = getWhatsAppUrl(undefined, undefined, undefined, whatsappNumber, selectedStore?.name);

  // Obter próximo vendedor ao clicar em WhatsApp
  const handleWhatsAppClick = async () => {
    if (selectedStore && !selectedSalesperson) {
      await getNextSalesperson(selectedStore.id);
    }
  };

  return (
    <>
      {/* Barra de Aviso Superior Comercial */}
      <div
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
        ⚡ SUPER OFERTAS DE INAUGURAÇÃO • ATENDIMENTO DIRETO PELO WHATSAPP • PARCELAMENTO EM ATÉ 10X
      </div>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-brand-primary)',
          boxShadow: '0 4px 12px rgba(15, 3, 69, 0.25)',
          borderBottom: '2px solid rgba(254, 248, 38, 0.2)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
          }}
        >
          {/* Logo Oficial + Seletor de Loja */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="/images/logo-arruda.webp"
                alt="Arruda Móveis Eletro"
                style={{
                  height: '42px',
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
                    fontSize: '1.25rem',
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
                    fontSize: '0.7rem',
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

            {/* Seletor de Loja */}
            {selectedStore && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    border: '1px solid rgba(254, 248, 38, 0.3)',
                    cursor: 'pointer',
                  }}
                >
                  <MapPin size={14} />
                  <span>{selectedStore.name}</span>
                  <ChevronDown size={14} />
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
                          // TODO: Abrir modal de seleção de loja
                        }}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: 'transparent',
                          color: '#2563eb',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderRadius: '4px',
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

          {/* Ações: WhatsApp e Botão Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="btn-hover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-whatsapp)',
                color: '#ffffff',
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '0.875rem',
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

            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir Menu"
              className="nav-mobile-btn"
              style={{
                padding: '8px',
                color: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ width: '22px', height: '2px', backgroundColor: '#ffffff', display: 'block' }} />
                <span style={{ width: '22px', height: '2px', backgroundColor: '#ffffff', display: 'block' }} />
                <span style={{ width: '22px', height: '2px', backgroundColor: '#ffffff', display: 'block' }} />
              </div>
            </button>
          </div>
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
