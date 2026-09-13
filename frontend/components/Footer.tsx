import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-brand-primary)',
        color: 'var(--color-border)',
        borderTop: '1px solid var(--color-brand-secondary)',
        padding: '3rem 0 2rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Coluna 1: Marca */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src="/images/logo-arruda.webp"
                alt="Arruda Móveis Eletro"
                style={{
                  height: '38px',
                  width: 'auto',
                  borderRadius: 'var(--radius-sm)',
                  objectFit: 'contain',
                }}
              />
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text-inverse)' }}>
                ARRUDA MÓVEIS ELETRO
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
              Tradição, variedade e os melhores preços em móveis e eletrodomésticos para toda a família com
              atendimento rápido pelo WhatsApp.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 style={{ color: 'var(--color-text-inverse)', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>
              Departamentos
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li>
                <Link href="/categoria/sala-de-estar" style={{ color: 'var(--color-text-muted)' }}>
                  Sala de Estar
                </Link>
              </li>
              <li>
                <Link href="/categoria/quarto" style={{ color: 'var(--color-text-muted)' }}>
                  Quarto e Colchões
                </Link>
              </li>
              <li>
                <Link href="/categoria/cozinha" style={{ color: 'var(--color-text-muted)' }}>
                  Cozinha e Armários
                </Link>
              </li>
              <li>
                <Link href="/categoria/eletrodomesticos" style={{ color: 'var(--color-text-muted)' }}>
                  Eletrodomésticos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" style={{ color: 'var(--color-accent-highlight)', fontWeight: 600 }}>
                  Ofertas da Semana
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento e Loja */}
          <div>
            <h4 style={{ color: 'var(--color-text-inverse)', fontSize: '1rem', marginBottom: '1rem', fontWeight: 700 }}>
              Atendimento Comercial
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              <strong>Segunda a Sexta:</strong> 08:00 às 18:00
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>
              <strong>Sábado:</strong> 08:00 às 14:00
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Atendimento exclusivo para vendas e cotação de frete via WhatsApp.
            </p>
          </div>
        </div>

        {/* Divisor e Direitos */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <p>© {new Date().getFullYear()} Arruda Móveis Eletro — Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
