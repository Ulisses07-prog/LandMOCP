'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopProduct {
  product_id: number;
  name: string;
  views: number;
  whatsapp_clicks: number;
}

interface DashboardStats {
  published_products: number;
  draft_products: number;
  active_offers: number;
  total_views: number;
  total_whatsapp_clicks: number;
  top_products: TopProduct[];
  period_days: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<number>(7);
  const [stats, setStats] = useState<DashboardStats>({
    published_products: 4,
    draft_products: 1,
    active_offers: 3,
    total_views: 142,
    total_whatsapp_clicks: 28,
    top_products: [
      { product_id: 1, name: 'Sofá Retrátil 3 Lugares Veludo', views: 82, whatsapp_clicks: 18 },
      { product_id: 4, name: 'Geladeira Frost Free Duplex 400L', views: 44, whatsapp_clicks: 8 },
      { product_id: 2, name: 'Armário de Cozinha Completo 6 Portas', views: 16, whatsapp_clicks: 2 },
    ],
    period_days: 7,
  });

  const [userName, setUserName] = useState('Administrador');

  useEffect(() => {
    const userStr = localStorage.getItem('arruda_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserName(u.name || 'Administrador');
      } catch {}
    }

    const token = localStorage.getItem('arruda_token');
    if (token) {
      fetch(`http://localhost:8000/api/v1/analytics/dashboard?period_days=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.data) {
            setStats(json.data);
          }
        })
        .catch(() => {});
    }
  }, [period]);

  const handleLogout = () => {
    localStorage.removeItem('arruda_token');
    localStorage.removeItem('arruda_user');
    router.push('/admin/login');
  };

  const conversionRate = stats.total_views > 0
    ? ((stats.total_whatsapp_clicks / stats.total_views) * 100).toFixed(1)
    : '0.0';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar Administrativa */}
      <header
        style={{
          backgroundColor: 'var(--color-brand-primary)',
          color: '#ffffff',
          padding: '1rem 0',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-accent-highlight)',
                  color: 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                }}
              >
                A
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>Arruda Admin</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-border)' }}>
              Olá, <strong>{userName}</strong>
            </span>
            <Link href="/" target="_blank" style={{ fontSize: '0.8125rem', color: 'var(--color-accent-highlight)' }}>
              Ver Loja ↗
            </Link>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '0.4rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo do Dashboard */}
      <main style={{ flex: 1, padding: '2.5rem 0' }}>
        <div className="container">
          {/* Cabeçalho de Métricas e Seletor de Período */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                Painel Geral & Conversão
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
                Acompanhe o desempenho de catálogo e captação de leads pelo WhatsApp
              </p>
            </div>

            {/* Seletor de Período */}
            <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {[
                { label: 'Hoje', days: 1 },
                { label: '7 dias', days: 7 },
                { label: '30 dias', days: 30 },
              ].map((p) => (
                <button
                  key={p.days}
                  onClick={() => setPeriod(p.days)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: period === p.days ? 700 : 500,
                    backgroundColor: period === p.days ? 'var(--color-brand-primary)' : 'transparent',
                    color: period === p.days ? '#ffffff' : 'var(--color-text-primary)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards de Métricas (KPIs) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block' }}>
                🟢 Cliques em WhatsApp
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-whatsapp)', display: 'block', margin: '0.5rem 0' }}>
                {stats.total_whatsapp_clicks}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Taxa de conversão: {conversionRate}%
              </span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block' }}>
                👁️ Visualizações Totais
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-brand-primary)', display: 'block', margin: '0.5rem 0' }}>
                {stats.total_views}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Nos últimos {period} dias
              </span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block' }}>
                🔥 Ofertas Ativas
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#b45309', display: 'block', margin: '0.5rem 0' }}>
                {stats.active_offers}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Com vigência no catálogo
              </span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block' }}>
                📦 Produtos Publicados
              </span>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-brand-primary)', display: 'block', margin: '0.5rem 0' }}>
                {stats.published_products}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {stats.draft_products} rascunho(s) pendente(s)
              </span>
            </div>
          </div>

          {/* Tabela de Produtos Mais Procurados */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBottom: '1.25rem' }}>
              Produtos Líderes de Interesse (Leads via WhatsApp)
            </h2>

            {stats.top_products.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Ainda não há dados suficientes no período selecionado.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Produto</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Visualizações</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Cliques WhatsApp</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Taxa de Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_products.map((prod) => {
                      const rate = prod.views > 0 ? ((prod.whatsapp_clicks / prod.views) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={prod.product_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>{prod.name}</td>
                          <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>{prod.views}</td>
                          <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: 'var(--color-whatsapp)', fontWeight: 700 }}>
                            {prod.whatsapp_clicks}
                          </td>
                          <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                            {rate}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
