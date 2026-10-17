'use client';

import React from 'react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useStore } from '@/contexts/StoreContext';
import { MessageSquareText, MapPin, Calculator, ArrowRight } from 'lucide-react';

export default function ArrudaServiceCards() {
  const { selectedStore, storeWhatsAppNumber, openStoreModal } = useStore();
  const whatsappUrl = getWhatsAppUrl(undefined, undefined, undefined, storeWhatsAppNumber, selectedStore?.name);

  return (
    <section style={{ padding: '3rem 0', backgroundColor: '#f8fafc' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-brand-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Atendimento Humanizado
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-brand-primary)', margin: '4px 0 6px 0' }}>
            Canais de Atendimento Arruda
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', maxWidth: '600px', margin: '0 auto' }}>
            Escolha o melhor canal para fechar sua compra com total segurança e comodidade
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Card 1: WhatsApp */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(15, 3, 69, 0.06)',
            }}
            className="card-hover"
          >
            <div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <MessageSquareText size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
                Atendimento VIP no WhatsApp
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Negocie valores à vista, consulte medidas exatas para sua casa e combine o melhor dia de entrega com nossos vendedores.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                backgroundColor: 'var(--color-whatsapp)',
                color: '#ffffff',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}
            >
              <span>Falar no WhatsApp</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Card 2: Lojas Físicas */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(15, 3, 69, 0.06)',
            }}
            className="card-hover"
          >
            <div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <MapPin size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
                Rede de Lojas & Filiais
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Conheça nossos showrooms em Monteiro, Sumé, Sertânia e São Sebastião do Umbuzeiro para ver os móveis de perto.
              </p>
            </div>
            <button
              onClick={openStoreModal}
              className="btn-hover"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: '#ffffff',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Ver Nossas Unidades</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Crediário e Pagamento */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(15, 3, 69, 0.06)',
            }}
            className="card-hover"
          >
            <div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#fffbeb',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Calculator size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
                Crediário Fácil Arruda
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Aproveite aprovação rápida no carnê da loja, parcelamento em até 10x sem juros no cartão ou condição especial no PIX.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--color-brand-primary)',
                border: '2px solid var(--color-brand-primary)',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}
            >
              <span>Simular Parcelas</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
