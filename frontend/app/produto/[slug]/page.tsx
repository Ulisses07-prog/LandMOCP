import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import ShareButtons from '@/components/ShareButtons';
import StickyWhatsAppBar from '@/components/StickyWhatsAppBar';
import ProductCard from '@/components/ProductCard';

import { getProductBySlug, getProducts } from '@/lib/api';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Produto não encontrado | Arruda Móveis Eletro' };

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  return {
    title: `${product.name} | Arruda Móveis Eletro`,
    description: product.short_description || `Confira ${product.name} com os melhores preços na Arruda Móveis.`,
    openGraph: {
      title: `${product.name} | Arruda Móveis Eletro`,
      description: product.short_description || `Confira ${product.name} com os melhores preços na Arruda Móveis.`,
      images: primaryImage?.url ? [{ url: primaryImage.url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const hasOffer = Boolean(product.promo_price && product.promo_price < product.price);
  const currentPrice = hasOffer ? Number(product.promo_price) : Number(product.price);
  const originalPrice = Number(product.price);
  const discountPercent = product.offer?.discount_percent || (hasOffer ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const whatsappUrl = getWhatsAppUrl(product.name, product.sku);

  // Schema.org JSON-LD para SEO rico
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description,
    sku: product.sku,
    image: primaryImage?.url,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Arruda Móveis Eletro',
    },
    offers: {
      '@type': 'Offer',
      price: currentPrice,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `https://arrudamoveis.com.br/produto/${product.slug}`,
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px' }}>
      {/* Schema.org estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main style={{ flex: 1, padding: '2.5rem 0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '1.75rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            <Link href="/" style={{ color: 'var(--color-brand-accent)' }}>
              Início
            </Link>{' '}
            / <Link href="/catalogo">Catálogo</Link> / <span>{product.name}</span>
          </div>

          {/* Grid Principal: Galeria e Informações */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
              marginBottom: '4rem',
            }}
          >
            {/* Coluna Esquerda: Galeria */}
            <div>
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Coluna Direita: Dados Comerciais e Compra */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    {product.brand || 'Arruda Móveis Eletro'}
                  </span>
                  {product.sku && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Cód: {product.sku}
                    </span>
                  )}
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.125rem)',
                    fontWeight: 800,
                    color: 'var(--color-brand-primary)',
                    lineHeight: 1.25,
                  }}
                >
                  {product.name}
                </h1>
              </div>

              {/* Bloco de Preço */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {hasOffer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                      R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'var(--color-accent-highlight)',
                        color: 'var(--color-brand-primary)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    >
                      -{discountPercent}% OFF
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                    R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    à vista no Pix
                  </span>
                </div>

                {product.payment_condition && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                    💳 {product.payment_condition}
                  </p>
                )}

                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-success)',
                    fontWeight: 700,
                    backgroundColor: '#dcfce7',
                    padding: '0.25rem 0.625rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  ✓ {product.availability}
                </span>
              </div>

              {/* Botão de Conversão WhatsApp Principal */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'var(--color-whatsapp)',
                  color: '#ffffff',
                  padding: '1rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'background-color var(--transition-fast)',
                  minHeight: '52px',
                }}
                className="whatsapp-btn"
              >
                <span>Comprar pelo WhatsApp</span>
              </a>

              {/* Compartilhar */}
              <ShareButtons productName={product.name} />

              {/* Ficha Técnica */}
              <div style={{ marginTop: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Especificações Técnicas
                </h2>
                <div
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <tbody>
                      {product.dimensions && (
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.625rem 1rem', fontWeight: 600, color: 'var(--color-text-secondary)', width: '40%' }}>
                            Dimensões (L x A x P)
                          </td>
                          <td style={{ padding: '0.625rem 1rem' }}>{product.dimensions}</td>
                        </tr>
                      )}
                      {product.material && (
                        <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                          <td style={{ padding: '0.625rem 1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            Material
                          </td>
                          <td style={{ padding: '0.625rem 1rem' }}>{product.material}</td>
                        </tr>
                      )}
                      {product.color && (
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.625rem 1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            Cor / Acabamento
                          </td>
                          <td style={{ padding: '0.625rem 1rem' }}>{product.color}</td>
                        </tr>
                      )}
                      {product.weight && (
                        <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-base)' }}>
                          <td style={{ padding: '0.625rem 1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            Peso
                          </td>
                          <td style={{ padding: '0.625rem 1rem' }}>{product.weight}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Descrição Detalhada */}
              {product.description && (
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Descrição do Produto
                  </h2>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Produtos Relacionados */}
          {relatedProducts.length > 0 && (
            <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1.5rem' }}>
                Produtos Relacionados
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Barra de Conversão Fixa no Mobile */}
      <StickyWhatsAppBar
        productName={product.name}
        sku={product.sku}
        price={Number(product.price)}
        promoPrice={product.promo_price ? Number(product.promo_price) : undefined}
      />

      <Footer />
    </div>
  );
}
