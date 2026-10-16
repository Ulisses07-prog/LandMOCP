import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import HeroSearch from '@/components/HeroSearch';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import QuickShortcuts from '@/components/QuickShortcuts';
import FlashOffers from '@/components/FlashOffers';
import CampaignBanner from '@/components/CampaignBanner';
import HeroBannerSlider from '@/components/HeroBannerSlider';
import LocationDetector from '@/components/LocationDetector';
import { getProducts, getCategories } from '@/lib/api';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { Truck, CreditCard, MessageSquare, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const AMBIENTES = [
  {
    titulo: 'Móveis para Quarto',
    slug: 'moveis-para-quarto',
    tag: 'Dormitório',
    destaque: 'Roupeiros, Camas Box, Cômodas & Cabeceiras',
    imagem: '/images/ambiente-quarto.webp',
  },
  {
    titulo: 'Móveis para Sala',
    slug: 'moveis-para-sala',
    tag: 'Living & Estar',
    destaque: 'Sofás, Racks, Painéis & Poltronas',
    imagem: '/images/ambiente-sala.webp',
  },
  {
    titulo: 'Cozinha & Sala de Jantar',
    slug: 'cozinha-sala-de-jantar',
    tag: 'Gourmet & Jantar',
    destaque: 'Mesas, Balcões, Armários & Cadeiras',
    imagem: '/images/ambiente-cozinha.webp',
  },
  {
    titulo: 'Eletrodomésticos',
    slug: 'eletrodomesticos',
    tag: 'Linha Branca & Inox',
    destaque: 'Geladeiras, Fogões, Freezers & Lavadoras',
    imagem: '/images/ambiente-eletro.webp',
  },
  {
    titulo: 'TV, Áudio & Home Theater',
    slug: 'tv-e-audio',
    tag: 'Cinema em Casa',
    destaque: 'Smart TVs 4K, Caixas de Som & Suportes',
    imagem: '/images/ambiente-tv.webp',
  },
  {
    titulo: 'Eletroportáteis',
    slug: 'eletroportateis',
    tag: 'Praticidade & Gourmet',
    destaque: 'Fritadeiras Airfryer, Cafeteiras & Utensílios',
    imagem: '/images/ambiente-portateis.webp',
  },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ pageSize: 50 }),
    getCategories(),
  ]);

  // Filtrar produtos com fotos reais e pronta entrega
  const prontaEntrega = products.filter((p) => p.availability === 'Pronta Entrega');
  const ofertas = products.filter((p) => p.promo_price && Number(p.promo_price) < Number(p.price));

  const produtosDestaque = prontaEntrega.length >= 4 
    ? prontaEntrega.slice(0, 8) 
    : products.slice(0, 8);

  const whatsappUrlGeral = getWhatsAppUrl();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <LocationDetector />
      <Header />

      {/* Mosaico de Atalhos Rápidos (Mobile-First / Estilo Casas Bahia) */}
      <QuickShortcuts />

      <main style={{ flex: 1 }}>
        {/* ================= APHeroBanner CARROSSEL RESPONSIVO (SEM CORTES) ================= */}
        <HeroBannerSlider />

        {/* ================= BARRA DE BUSCA RÁPIDA CENTRAL ================= */}
        <section
          style={{
            background: 'linear-gradient(135deg, #090326 0%, #0f0345 100%)',
            padding: '1.75rem 0 2rem 0',
            borderBottom: '4px solid var(--color-accent-highlight)',
            color: '#ffffff',
          }}
        >
          <div className="container" style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(254, 248, 38, 0.18)',
                color: 'var(--color-accent-highlight)',
                border: '1px solid rgba(254, 248, 38, 0.45)',
                padding: '0.4rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={16} /> MÓVEIS & ELETRODOMÉSTICOS COM PRONTA ENTREGA
            </span>

            <h1
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
                maxWidth: '820px',
                margin: '0 auto 1.25rem auto',
              }}
            >
              Qualidade, Estilo e o Melhor Preço da Região
            </h1>

            <HeroSearch />
          </div>
        </section>

        {/* ================= OFERTAS RELÂMPAGO COM PRODUTOS DO ENCARTE DE OUTUBRO ================= */}
        <FlashOffers />

        {/* ================= BANNER DE CAMPANHA FESTIVAL DA CASA NOVA ================= */}
        <CampaignBanner />

        {/* ================= PILARES DE CONFIANÇA ================= */}
        <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.75rem 0' }}>
          <div className="container">
            <div className="pillars-grid">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '10px', borderRadius: 'var(--radius-md)', color: '#2563eb' }}>
                  <Truck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Entrega Rápida e Segura</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Agilidade e cuidado direto na sua porta</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ backgroundColor: '#fefce8', padding: '10px', borderRadius: 'var(--radius-md)', color: '#ca8a04' }}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Até 10x Sem Juros</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>No cartão ou com desconto no PIX</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: 'var(--radius-md)', color: '#16a34a' }}>
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Atendimento Direto</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Orçamento rápido e humanizado via WhatsApp</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ backgroundColor: '#faf5ff', padding: '10px', borderRadius: 'var(--radius-md)', color: '#9333ea' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Garantia & Confiança</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Produtos novos com nota fiscal oficial</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMPRE POR AMBIENTE ================= */}
        <section style={{ padding: '4rem 0 3.5rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-brand-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Navegue pela Loja
                </span>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                  Compre por Ambiente
                </h2>
              </div>
              <Link href="/catalogo" style={{ color: 'var(--color-brand-accent)', fontWeight: 800, fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>Ver todo o catálogo</span> <ArrowRight size={16} />
              </Link>
            </div>

            <div className="category-grid">
              {AMBIENTES.map((amb) => (
                <Link
                  key={amb.slug}
                  href={`/categoria/${amb.slug}`}
                  className="ambient-card"
                >
                  <img
                    src={amb.imagem}
                    alt={amb.titulo}
                    className="ambient-card-bg"
                    loading="lazy"
                  />
                  <div className="ambient-card-overlay" />
                  <div className="ambient-card-content">
                    <span className="ambient-card-badge">{amb.tag}</span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.25, margin: 0, textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                      {amb.titulo}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.35, margin: '4px 0 10px 0', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      {amb.destaque}
                    </p>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        color: 'var(--color-accent-highlight)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      Explorar modelos <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* ================= PRODUTOS EM DESTAQUE / PRONTA ENTREGA ================= */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estoque Disponível
                </span>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--color-brand-primary)', marginTop: '2px' }}>
                  ⭐ Produtos com Pronta Entrega
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
                  Móveis selecionados prontos para envio imediato para a sua casa
                </p>
              </div>
              <Link href="/catalogo?pronta_entrega=true" style={{ color: 'var(--color-brand-primary)', fontWeight: 800, fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>Ver pronta entrega</span> <ArrowRight size={16} />
              </Link>
            </div>

            <div className="products-grid">
              {produtosDestaque.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= BANNER DE ATENDIMENTO WHATSAPP ================= */}
        <section style={{ padding: '0 0 4rem 0' }}>
          <div className="container">
            <div
              style={{
                background: 'linear-gradient(135deg, #0f0345 0%, #1e1b4b 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem 2rem',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                border: '2px solid rgba(254, 248, 38, 0.3)',
              }}
            >
              <span style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</span>
              <h3 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 900, marginBottom: '0.75rem', color: '#ffffff' }}>
                Precisa de Ajuda ou Quer Negociar um Desconto?
              </h3>
              <p style={{ color: '#cbd5e1', maxWidth: '640px', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Nossa equipe de consultores de vendas está pronta no WhatsApp para calcular seu frete, tirar dúvidas sobre medidas e fechar as melhores condições de pagamento.
              </p>
              <a
                href={whatsappUrlGeral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover"
                style={{
                  backgroundColor: 'var(--color-whatsapp)',
                  color: '#ffffff',
                  padding: '1rem 2.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                }}
              >
                <span>Falar com um Consultor no WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Botão Flutuante de WhatsApp fixo no canto inferior */}
      <WhatsAppFloat />

      <Footer />
    </div>
  );
}
