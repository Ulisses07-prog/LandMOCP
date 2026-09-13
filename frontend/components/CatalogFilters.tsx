'use client';

import React, { useState } from 'react';
import { Category } from '@/types/catalog';

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  search: string;
  onSearchChange: (text: string) => void;
  onlyOffers: boolean;
  onToggleOnlyOffers: (val: boolean) => void;
  orderBy: string;
  onOrderByChange: (order: string) => void;
  totalProducts: number;
}

export default function CatalogFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
  onlyOffers,
  onToggleOnlyOffers,
  orderBy,
  onOrderByChange,
  totalProducts,
}: CatalogFiltersProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const filtersContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Busca */}
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Buscar produto
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ex: Sofá, Armário, Geladeira..."
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-surface)',
            fontSize: '0.875rem',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>

      {/* Apenas Ofertas */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => onToggleOnlyOffers(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-brand-primary)' }}
          />
          <span>🔥 Apenas Ofertas</span>
        </label>
      </div>

      {/* Categorias */}
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Categorias
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button
            onClick={() => onSelectCategory('')}
            style={{
              textAlign: 'left',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: selectedCategory === '' ? 700 : 500,
              backgroundColor: selectedCategory === '' ? 'var(--color-brand-primary)' : 'transparent',
              color: selectedCategory === '' ? '#ffffff' : 'var(--color-text-primary)',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            Todas as Categorias
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: selectedCategory === cat.slug ? 700 : 500,
                backgroundColor: selectedCategory === cat.slug ? 'var(--color-brand-primary)' : 'transparent',
                color: selectedCategory === cat.slug ? '#ffffff' : 'var(--color-text-primary)',
                transition: 'background-color var(--transition-fast)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ordenação */}
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Ordenar por
        </label>
        <select
          value={orderBy}
          onChange={(e) => onOrderByChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-surface)',
            fontSize: '0.875rem',
            color: 'var(--color-text-primary)',
          }}
        >
          <option value="recent">Mais Recentes</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
          <option value="name_asc">Nome (A - Z)</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Barra de Ações Mobile: Botão Filtrar e Total */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
        className="mobile-filter-bar"
      >
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {totalProducts} produto(s) encontrado(s)
        </span>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-brand-primary)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: '44px',
          }}
          className="open-drawer-btn"
        >
          <span>Filtros</span>
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          height: 'fit-content',
        }}
        className="desktop-sidebar"
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Filtros</h3>
        {filtersContent}
      </aside>

      {/* Drawer Mobile */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: '85%',
              maxWidth: '360px',
              backgroundColor: 'var(--color-bg-surface)',
              height: '100%',
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Filtros</h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                style={{ fontSize: '1.5rem', fontWeight: 700, padding: '4px' }}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            {filtersContent}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                marginTop: '2rem',
                backgroundColor: 'var(--color-brand-primary)',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                width: '100%',
                minHeight: '44px',
              }}
            >
              Ver {totalProducts} Resultados
            </button>
          </div>
        </div>
      )}
    </>
  );
}
