import React from 'react';

export default function HomePage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581999999999';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Olá! Estava navegando no catálogo da Arruda Móveis e gostaria de falar com um vendedor.'
  )}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Sticky */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--color-brand-primary)',
          color: 'var(--color-text-inverse)',
          boxShadow: 'var(--shadow-md)',
          padding: '0.875rem 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-accent-highlight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: 'var(--color-brand-primary)',
              }}
            >
              A
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                ARRUDA
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'block',
                  color: 'var(--color-accent-highlight)',
                  marginTop: '-4px',
                }}
              >
                MÓVEIS ELETRO
              </span>
            </div>
          </div>

          {/* WhatsApp Direct CTA */}
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
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            <span>WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section
          style={{
            background: 'linear-gradient(135deg, #0b172a 0%, #1e293b 100%)',
            color: 'var(--color-text-inverse)',
            padding: '4rem 0',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '800px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(250, 204, 21, 0.15)',
                color: 'var(--color-accent-highlight)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Catálogo Oficial & Ofertas da Semana
            </span>
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Transforme sua casa com os melhores preços e condições
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-border)',
                marginBottom: '2rem',
                lineHeight: 1.6,
              }}
            >
              Móveis para sala, quarto, cozinha e eletrodomésticos com entrega garantida e
              atendimento exclusivo direto pelo WhatsApp.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="#catalogo"
                style={{
                  backgroundColor: 'var(--color-accent-highlight)',
                  color: 'var(--color-brand-primary)',
                  padding: '0.75rem 1.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                VER CATÁLOGO
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--color-whatsapp)',
                  color: '#ffffff',
                  padding: '0.75rem 1.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                FALAR COM VENDEDOR
              </a>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="catalogo" style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: 'var(--color-brand-primary)',
              }}
            >
              Categorias em Destaque
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                marginBottom: '2rem',
                fontSize: '1rem',
              }}
            >
              Navegue pelos nossos departamentos e encontre o produto ideal.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {[
                'Sala',
                'Quarto',
                'Cozinha',
                'Mesas e Cadeiras',
                'Racks e Painéis',
                'Armários',
                'Escritório',
                'Eletro',
              ].map((cat) => (
                <div
                  key={cat}
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-card)',
                    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                  }}
                >
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{cat}</h3>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-brand-accent)',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                      fontWeight: 500,
                    }}
                  >
                    Ver produtos →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'var(--color-brand-primary)',
          color: 'var(--color-border)',
          padding: '2.5rem 0',
          borderTop: '1px solid var(--color-brand-secondary)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <p style={{ fontWeight: 600, color: 'var(--color-text-inverse)' }}>
            Arruda Móveis Eletro — Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Atendimento comercial via WhatsApp • Entrega e montagem facilitadas
          </p>
        </div>
      </footer>
    </div>
  );
}
