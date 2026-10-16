'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useStore } from '@/contexts/StoreContext';

export default function CampaignBanner() {
  const { selectedStore, storeWhatsAppNumber } = useStore();
  const whatsappUrl = getWhatsAppUrl(
    undefined,
    undefined,
    undefined,
    storeWhatsAppNumber,
    selectedStore?.name,
    'Olá! Vi o Festival da Casa Nova no site da Arruda Móveis e gostaria de consultar as condições com desconto no PIX.'
  );

  return (
    <section style={{ padding: '2rem 0', backgroundColor: '#f8fafc' }}>
      <div className="container">
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #090326 0%, #0f0345 50%, #1a1061 100%)',
            borderRadius: '20px',
            overflow: 'hidden',
            padding: '2.5rem 2rem',
            color: '#ffffff',
            boxShadow: '0 12px 32px rgba(15, 3, 69, 0.22)',
            border: '2px solid rgba(254, 248, 38, 0.35)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          {/* Efeito sutil de brilho de fundo */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              background: 'radial-gradient(circle, rgba(254, 248, 38, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(254, 248, 38, 0.18)',
                color: 'var(--color-accent-highlight)',
                border: '1px solid rgba(254, 248, 38, 0.4)',
                padding: '0.35rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={14} /> FESTIVAL DA CASA NOVA • ARRUDA MÓVEIS
            </span>

            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
              }}
            >
              Renove Toda Sua Casa em até <span style={{ color: 'var(--color-accent-highlight)' }}>10x Sem Juros</span> ou com Desconto Exclusivo no PIX
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Mais de 12.000 opções com pronta entrega e atendimento humanizado direto pelos nossos consultores.
            </p>

            {/* Selos de Benefícios */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8125rem', color: '#f1f5f9' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={16} color="var(--color-accent-highlight)" /> Entrega Rápida e Cuidada
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--color-accent-highlight)" /> Produtos Novos com Garantia
              </span>
            </div>
          </div>

          {/* Botões de Ação Imediata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: '240px', position: 'relative', zIndex: 2 }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover"
              style={{
                backgroundColor: 'var(--color-whatsapp)',
                color: '#ffffff',
                padding: '1rem 1.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(34, 197, 94, 0.45)',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={20} />
              <span>Negociar no WhatsApp</span>
            </a>

            <Link
              href="/catalogo"
              className="btn-hover"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                padding: '0.85rem 1.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none',
              }}
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
