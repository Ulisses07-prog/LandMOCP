'use client';

import React, { useState } from 'react';
import { Category, SubgroupItem } from '@/types/catalog';
import { SlidersHorizontal, X } from 'lucide-react';

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
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ex: Sofá, Armário, Geladeira..."
            style={{
              width: '100%',
              padding: '0.625rem 2rem 0.625rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-surface)',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>
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
                onClick={() => onStockFilterChange?.(isSelected ? 'all' : (item.id as any))}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '260px', overflowY: 'auto' }}>
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
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? '' : cat.slug)}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--color-brand-primary)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {cat.name}
              </button>
            );
          })}
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

  const activeFiltersCount =
    (search ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (selectedSubgroup ? 1 : 0) +
    (onlyOffers ? 1 : 0) +
    (stockFilter !== 'all' ? 1 : 0);

  const handleClearFilters = () => {
    onSearchChange('');
    onSelectCategory('');
    onSelectSubgroup?.('');
    onToggleOnlyOffers(false);
    onStockFilterChange?.('all');
  };

  return (
    <>
      {/* Barra de Ações Mobile: Botão Filtrar e Total Centralizados */}
      <div className="mobile-filter-bar">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="btn-hover"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            backgroundColor: 'var(--color-brand-primary)',
            color: '#ffffff',
            padding: '0.75rem 2rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '0.9375rem',
            boxShadow: '0 4px 14px rgba(15, 3, 69, 0.28)',
            border: '2px solid rgba(254, 248, 38, 0.45)',
            cursor: 'pointer',
            minHeight: '46px',
          }}
        >
          <SlidersHorizontal size={18} color="var(--color-accent-highlight)" />
          <span>Filtros do Catálogo</span>
          {activeFiltersCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--color-accent-highlight)',
                color: 'var(--color-brand-primary)',
                fontSize: '0.75rem',
                fontWeight: 900,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                lineHeight: 1,
              }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>

        <span
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {totalProducts} produto(s) encontrado(s)
        </span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Filtros</h3>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              style={{
                fontSize: '0.75rem',
                color: '#ef4444',
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Limpar
            </button>
          )}
        </div>
        {filtersContent}
      </aside>

      {/* Drawer Mobile */}
      {mobileDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 3, 69, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: '88%',
              maxWidth: '380px',
              backgroundColor: 'var(--color-bg-surface)',
              height: '100%',
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={20} color="var(--color-brand-primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>Filtros</h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  padding: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {filtersContent}

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: '#ffffff',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.9375rem',
                  width: '100%',
                  minHeight: '46px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(15, 3, 69, 0.25)',
                }}
              >
                Ver {totalProducts} Resultados
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    width: '100%',
                    border: 'none',
                  }}
                >
                  Limpar Todos os Filtros
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
