import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/api';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const category = categories.find((c) => c.slug === params.slug);
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category_id === category.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '2.5rem 0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            <Link href="/" style={{ color: 'var(--color-brand-accent)' }}>
              Início
            </Link>{' '}
            / <Link href="/catalogo">Catálogo</Link> / <span>{category.name}</span>
          </div>

          {/* Cabeçalho da Categoria */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '2.5rem',
            }}
          >
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '0.5rem' }}>
              {category.name}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              {category.description || `Confira as melhores opções em ${category.name} para a sua casa.`}
            </p>
          </div>

          {/* Grid de Produtos da Categoria */}
          {categoryProducts.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem 2rem',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Nenhum produto cadastrado nesta categoria
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Novidades estão chegando em breve para {category.name}.
              </p>
              <Link
                href="/catalogo"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: '#ffffff',
                  padding: '0.625rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Ver Outros Departamentos
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
