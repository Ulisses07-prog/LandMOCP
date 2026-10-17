'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CatalogFilters from '@/components/CatalogFilters';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Product, Category, SubgroupItem } from '@/types/catalog';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, getProducts, getCategories, getSubgroups } from '@/lib/api';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoria') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [subgroups, setSubgroups] = useState<SubgroupItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>('');
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'preorder'>('all');
  const [orderBy, setOrderBy] = useState<string>('recent');
  const [loading, setLoading] = useState<boolean>(false);

  // Sincronizar parâmetros vindos da URL (ex: busca rápida no header/home)
  useEffect(() => {
    const urlCat = searchParams.get('categoria') || '';
    const urlSearch = searchParams.get('search') || '';
    if (urlCat) setSelectedCategory(urlCat);
    if (urlSearch) {
      setSearch(urlSearch);
      setDebouncedSearch(urlSearch);
    }
  }, [searchParams]);

  // Debounce para busca por digitação (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Carregar categorias iniciais
  useEffect(() => {
    let active = true;
    async function loadCategories() {
      try {
        const catData = await getCategories();
        if (active && catData && catData.length > 0) {
          setCategories(catData);
        }
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    }
    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  // Carregar subgrupos da categoria selecionada (ou gerais)
  useEffect(() => {
    let active = true;
    async function loadSubgroups() {
      try {
        const catObj = categories.find((c) => c.slug === selectedCategory);
        const subData = await getSubgroups(catObj ? catObj.id : undefined);
        if (active && subData) {
          setSubgroups(subData);
        }
      } catch (err) {
        console.error('Erro ao carregar subgrupos:', err);
      }
    }
    loadSubgroups();
    return () => {
      active = false;
    };
  }, [selectedCategory, categories]);

  // Handler para troca de categoria (reseta subgrupo)
  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setSelectedSubgroup('');
  };

  // Buscar produtos da API sempre que categoria, subgrupo ou busca debounced mudar
  useEffect(() => {
    let active = true;
    async function fetchProducts() {
      setLoading(true);
      try {
        const catObj = categories.find((c) => c.slug === selectedCategory);
        const prodData = await getProducts({
          categoryId: catObj ? catObj.id : undefined,
          subgroup: selectedSubgroup || undefined,
          search: debouncedSearch.trim() || undefined,
          pageSize: 100,
        });
        if (active && prodData) {
          setProducts(prodData);
        }
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      active = false;
    };
  }, [selectedCategory, selectedSubgroup, debouncedSearch, categories]);

  // Filtragem local complementar para resposta imediata
  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);

  const filteredProducts = products.filter((p) => {
    // Categoria selecionada
    if (currentCategoryObj && p.category_id && p.category_id !== currentCategoryObj.id) {
      return false;
    }

    // Subgrupo
    if (selectedSubgroup) {
      const pSub = (p.subgroup || '').toLowerCase().trim();
      const targetSub = selectedSubgroup.toLowerCase().trim();
      if (pSub !== targetSub && !pSub.includes(targetSub)) return false;
    }

    // Apenas ofertas
    if (onlyOffers) {
      const isOffer = Boolean((p.promo_price && p.promo_price < p.price) || (p.offer && p.offer.active));
      if (!isOffer) return false;
    }

    // Estoque / Disponibilidade
    if (stockFilter === 'in_stock') {
      const isProntaEntrega = p.availability === 'Pronta Entrega' || (p.stock !== undefined && p.stock > 0);
      if (!isProntaEntrega) return false;
    } else if (stockFilter === 'preorder') {
      const isSobEncomenda = p.availability === 'Sob Encomenda' || (p.stock !== undefined && p.stock <= 0);
      if (!isSobEncomenda) return false;
    }

    // Refinamento local para digitação imediata
    if (search.trim()) {
      const words = search.toLowerCase().trim().split(/\s+/);
      const targetText = `${p.name} ${p.brand || ''} ${p.sku || ''} ${p.subgroup || ''} ${p.group_name || ''}`.toLowerCase();
      const matchAll = words.every((w) => targetText.includes(w));
      if (!matchAll) return false;
    }

    return true;
  });

  // Ordenação com prioridade absoluta para estoque positivo
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const stockA = (a.stock && a.stock > 0) || a.availability === 'Pronta Entrega' ? 1 : 0;
    const stockB = (b.stock && b.stock > 0) || b.availability === 'Pronta Entrega' ? 1 : 0;
    if (stockA !== stockB) return stockB - stockA;

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
          <div style={{ marginBottom: '2rem' }} className="catalog-header-text">
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
          <div className="catalog-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <CatalogFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              subgroups={subgroups}
              selectedSubgroup={selectedSubgroup}
              onSelectSubgroup={setSelectedSubgroup}
              search={search}
              onSearchChange={setSearch}
              onlyOffers={onlyOffers}
              onToggleOnlyOffers={setOnlyOffers}
              stockFilter={stockFilter}
              onStockFilterChange={setStockFilter}
              orderBy={orderBy}
              onOrderByChange={setOrderBy}
              totalProducts={sortedProducts.length}
            />

            {/* Grid de Produtos */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading && (
                <div
                  style={{
                    backgroundColor: 'rgba(254, 248, 38, 0.15)',
                    border: '1px solid rgba(254, 248, 38, 0.4)',
                    color: 'var(--color-brand-primary)',
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textAlign: 'center',
                  }}
                >
                  ⚡ Buscando produtos no catálogo...
                </div>
              )}

              {sortedProducts.length === 0 && !loading ? (
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
                      setSelectedSubgroup('');
                      setOnlyOffers(false);
                      setStockFilter('all');
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

      <WhatsAppFloat />
      <Footer />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Carregando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
