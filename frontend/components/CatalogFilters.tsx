'use client';

import React, { useState } from 'react';
import { Category, SubgroupItem } from '@/types/catalog';

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  subgroups?: SubgroupItem[];
  selectedSubgroup?: string;
  onSelectSubgroup?: (subgroup: string) => void;
  search: string;
  onSearchChange: (text: string) => void;
  onlyOffers: boolean;
  onToggleOnlyOffers: (val: boolean) => void;
  stockFilter?: 'all' | 'in_stock' | 'preorder';
  onStockFilterChange?: (filter: 'all' | 'in_stock' | 'preorder') => void;
  orderBy: string;
  onOrderByChange: (order: string) => void;
  totalProducts: number;
}

export default function CatalogFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  subgroups = [],
  selectedSubgroup = '',
  onSelectSubgroup,
  search,
  onSearchChange,
  onlyOffers,
  onToggleOnlyOffers,
  stockFilter = 'all',
  onStockFilterChange,
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

      {/* Disponibilidade / Estoque */}
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Disponibilidade em Loja
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { id: 'all', label: 'Todos os Produtos' },
            { id: 'in_stock', label: '🟢 Apenas Pronta Entrega' },
            { id: 'preorder', label: '📦 Sob Encomenda' },
          ].map((item) => {
            const isSelected = stockFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onStockFilterChange?.(item.id as any)}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--color-brand-primary)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                  transition: 'background-color var(--transition-fast)',
                  border: isSelected ? 'none' : '1px solid #e2e8f0',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
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

      {/* Subgrupos / Tipos de Produto */}
      {subgroups && subgroups.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Tipos de Produto
            </label>
            {selectedSubgroup && (
              <button
                onClick={() => onSelectSubgroup?.('')}
                style={{ fontSize: '0.75rem', color: 'var(--color-brand-accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Ver todos
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
            <button
              onClick={() => onSelectSubgroup?.('')}
              style={{
                textAlign: 'left',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                fontWeight: selectedSubgroup === '' ? 700 : 500,
                backgroundColor: selectedSubgroup === '' ? 'rgba(15, 3, 69, 0.08)' : 'transparent',
                color: selectedSubgroup === '' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                border: selectedSubgroup === '' ? '1px solid var(--color-brand-primary)' : '1px solid transparent',
              }}
            >
              Todos os tipos
            </button>
            {subgroups.map((sub) => {
              const isSelected = selectedSubgroup === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => onSelectSubgroup?.(isSelected ? '' : sub.name)}
                  style={{
                    textAlign: 'left',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'var(--color-brand-primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--color-brand-primary)' : '#f1f5f9',
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{sub.name.toLowerCase()}</span>
                  <span style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6 }}>({sub.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
