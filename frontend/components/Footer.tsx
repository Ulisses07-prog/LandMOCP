import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-brand-primary)',
        color: '#e2e8f0',
        borderTop: '4px solid var(--color-accent-highlight)',
        padding: '3.5rem 0 2rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Coluna 1: Marca */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <img
                src="/images/logo-arruda.webp"
                alt="Arruda Móveis Eletro"
                style={{
                  height: '40px',
                  width: 'auto',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#ffffff',
                  padding: '2px',
                }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
                ARRUDA MÓVEIS
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Tradição, variedade e os melhores preços em móveis e eletrodomésticos para toda a família com atendimento rápido pelo WhatsApp.
            </p>
          </div>

          {/* Coluna 2: Departamentos */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--color-accent-highlight)',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Departamentos
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <li>
                <Link href="/categoria/moveis-para-sala" style={{ color: '#cbd5e1' }}>
                  Móveis para Sala
                </Link>
              </li>
              <li>
                <Link href="/categoria/moveis-para-quarto" style={{ color: '#cbd5e1' }}>
                  Móveis para Quarto
                </Link>
              </li>
              <li>
                <Link href="/categoria/cozinha-sala-de-jantar" style={{ color: '#cbd5e1' }}>
                  Cozinha & Jantar
                </Link>
              </li>
              <li>
                <Link href="/categoria/eletrodomesticos" style={{ color: '#cbd5e1' }}>
                  Eletrodomésticos
                </Link>
              </li>
              <li>
                <Link href="/ofertas" style={{ color: 'var(--color-accent-highlight)', fontWeight: 800 }}>
                  🔥 Ofertas da Semana
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--color-accent-highlight)',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Atendimento Comercial
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '0.5rem', lineHeight: 1.5 }}>
              <strong>Segunda a Sexta:</strong> 08:00 às 18:00<br />
              <strong>Sábados:</strong> 08:00 às 13:00
            </p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              Orçamentos, cálculo de frete e pronta entrega direto via WhatsApp.
            </p>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: '#94a3b8',
          }}
        >
          <p>© {new Date().getFullYear()} Arruda Móveis Eletro — Todos os direitos reservados. Catálogo digital comercial.</p>
        </div>
      </div>
    </footer>
  );
}
