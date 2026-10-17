'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeroSearch() {
  const [term, setTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(term.trim())}`);
    } else {
      router.push('/catalogo');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto', padding: '0 0.5rem' }}>
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-full)',
          padding: '0.35rem 0.4rem 0.35rem 0.85rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          border: '2px solid rgba(254, 248, 38, 0.4)',
          width: '100%',
        }}
      >
        <Search size={20} style={{ color: 'var(--color-text-muted)', marginRight: '0.5rem', flexShrink: 0 }} />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="O que você procura hoje?"
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            fontSize: '0.9375rem',
            color: 'var(--color-text-primary)',
            backgroundColor: 'transparent',
            fontWeight: 500,
          }}
        />
        <button
          type="submit"
          className="btn-hover"
          style={{
            backgroundColor: 'var(--color-accent-highlight)',
            color: 'var(--color-brand-primary)',
            border: 'none',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(254, 248, 38, 0.35)',
          }}
        >
          Buscar
        </button>
      </form>

      {/* Sugestões Rápidas */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '1rem',
          fontSize: '0.8125rem',
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>Sugestões:</span>
        {['Roupeiro ACP', 'Sofá', 'Cama Box', 'Rack', 'Fogão', 'Geladeira'].map((sug) => (
          <button
            key={sug}
            type="button"
            onClick={() => router.push(`/catalogo?search=${encodeURIComponent(sug)}`)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {sug}
          </button>
        ))}
      </div>
    </div>
  );
}
