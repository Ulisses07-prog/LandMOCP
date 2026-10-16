'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { Product } from '@/types/catalog';
import ProductCard from '@/components/ProductCard';

interface FlashOffersProps {
  products: Product[];
}

export default function FlashOffers({ products }: FlashOffersProps) {
  // Cronômetro regressivo com base de 72 horas para senso de urgência contínuo
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: '3.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Cabeçalho das Ofertas Relâmpago */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {/* Título com Raio Estilo Varejista */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-accent-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(15, 3, 69, 0.2)',
              }}
            >
              <Zap size={24} fill="var(--color-accent-highlight)" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                  fontWeight: 900,
                  color: 'var(--color-brand-primary)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Ofertas Relâmpago
              </h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Preços especiais negociados direto de fábrica com estoque limitado
              </span>
            </div>
          </div>

          {/* Contador Regressivo em Tempo Real (Estilo Casas Bahia) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={16} color="var(--color-brand-primary)" /> Encerra em:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-accent-highlight)',
                  fontWeight: 900,
                  fontSize: '0.9375rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  minWidth: '38px',
                  textAlign: 'center',
                }}
              >
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span style={{ fontWeight: 900, color: 'var(--color-brand-primary)' }}>:</span>
              <span
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-accent-highlight)',
                  fontWeight: 900,
                  fontSize: '0.9375rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  minWidth: '38px',
                  textAlign: 'center',
                }}
              >
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span style={{ fontWeight: 900, color: 'var(--color-brand-primary)' }}>:</span>
              <span
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-accent-highlight)',
                  fontWeight: 900,
                  fontSize: '0.9375rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  minWidth: '38px',
                  textAlign: 'center',
                }}
              >
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Vitrine de Produtos Relâmpago */}
        <div className="products-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Botão Ver Todas as Ofertas */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            href="/ofertas"
            className="btn-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-accent-highlight)',
              padding: '0.85rem 2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.9375rem',
              boxShadow: '0 4px 14px rgba(15, 3, 69, 0.25)',
              textDecoration: 'none',
            }}
          >
            <span>Ver Todas as Ofertas Relâmpago</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
