'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CatalogFilters from '@/components/CatalogFilters';
import { Product, Category } from '@/types/catalog';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/api';

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>('recent');

  // Filtragem dinâmica no cliente
  const filteredProducts = products.filter((p) => {
    // Categoria
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat && p.category_id !== cat.id) return false;
    }
    // Apenas ofertas
    if (onlyOffers) {
      const isOffer = Boolean(p.promo_price && p.promo_price < p.price);
      if (!isOffer) return false;
    }
    // Busca
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(query);
      const matchBrand = (p.brand || '').toLowerCase().includes(query);
      const matchSku = (p.sku || '').toLowerCase().includes(query);
      if (!matchName && !matchBrand && !matchSku) return false;
    }
    return true;
  });

  // Ordenação
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.promo_price ? Number(a.promo_price) : Number(a.price);
    const priceB = b.promo_price ? Number(b.promo_price) : Number(b.price);

    if (orderBy === 'price_asc') return priceA - priceB;
    if (orderBy === 'price_desc') return priceB - priceA;
    if (orderBy === 'name_asc') return a.name.localeCompare(b.name);
    return b.id - a.id; // recent
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '2.5rem 0' }}>
        <div className="container">
          {/* Breadcrumb e Título */}
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Início / Catálogo Completo
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginTop: '0.25rem' }}>
              Catálogo de Produtos
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
              Explore toda a linha de móveis e eletrodomésticos da Arruda Móveis
            </p>
          </div>

          {/* Layout com Sidebar e Grid */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <CatalogFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              search={search}
              onSearchChange={setSearch}
              onlyOffers={onlyOffers}
              onToggleOnlyOffers={setOnlyOffers}
              orderBy={orderBy}
              onOrderByChange={setOrderBy}
              totalProducts={sortedProducts.length}
            />

            {/* Grid de Produtos */}
            <div style={{ flex: 1 }}>
              {sortedProducts.length === 0 ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '3.5rem 2rem',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Nenhum produto encontrado
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Tente ajustar seus termos de busca ou remover os filtros aplicados.
                  </p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('');
                      setOnlyOffers(false);
                    }}
                    style={{
                      backgroundColor: 'var(--color-brand-primary)',
                      color: '#ffffff',
                      padding: '0.625rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
