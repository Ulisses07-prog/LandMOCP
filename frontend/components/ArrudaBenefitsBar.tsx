'use client';

import React from 'react';
import { Truck, MessageCircle, CreditCard, Store } from 'lucide-react';

const BENEFICIOS = [
  {
    icon: Truck,
    titulo: 'Entrega & Montagem Dedicada',
    descricao: 'Transporte seguro e montagem cuidadosa na sua região',
    color: '#0284c7',
    bg: '#f0f9ff',
  },
  {
    icon: MessageCircle,
    titulo: 'Consultoria Direta no WhatsApp',
    descricao: 'Negocie medidas, cores e descontos com atendente real',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    icon: CreditCard,
    titulo: 'Crediário Fácil em até 10x',
    descricao: 'Parcelamento sem juros no cartão ou desconto no PIX',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    icon: Store,
    titulo: 'Retirada Rápida em Loja',
    descricao: 'Compre online e retire com agilidade nas nossas filiais',
    color: '#7c3aed',
    bg: '#faf5ff',
  },
];

export default function ArrudaBenefitsBar() {
  return (
    <section style={{ backgroundColor: '#ffffff', padding: '1.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {BENEFICIOS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(15, 3, 69, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="card-hover"
              >
                <div
                  style={{
                    backgroundColor: item.bg,
                    color: item.color,
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      color: 'var(--color-brand-primary)',
                      lineHeight: 1.25,
                      marginBottom: '2px',
                    }}
                  >
                    {item.titulo}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.35,
                      margin: 0,
                    }}
                  >
                    {item.descricao}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
