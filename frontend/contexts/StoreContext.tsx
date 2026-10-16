'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Store, Salesperson } from '@/types/store';

interface StoreContextType {
  selectedStore: Store | null;
  selectedSalesperson: Salesperson | null;
  isLoading: boolean;
  error: string | null;
  selectStore: (store: Store) => void;
  detectStoreByLocation: () => Promise<void>;
  detectStoreBySubdomain: () => void;
  getNextSalesperson: (storeId: number) => Promise<Salesperson | null>;
}

const StoreContext = createContext<StoreContextType | null>(null);

// Lista de subdomínios para cidades
const SUBDOMAIN_MAP: Record<string, string> = {
  'piripiri': 'piripiri',
  'sao-jose': 'sao-jose-do-divino',
  'batalha': 'batalha',
  'esperantina': 'esperantina',
  'joaquim': 'joaquim-pires',
  'murici': 'murici-dos-portelas',
  'sao-joao': 'sao-joao-do-arraial',
  'matias': 'matias-olimpio',
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<Salesperson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar loja do localStorage ao montar
  useEffect(() => {
    const savedStore = localStorage.getItem('selectedStore');
    const savedSalesperson = localStorage.getItem('selectedSalesperson');
    
    if (savedStore) {
      try {
        setSelectedStore(JSON.parse(savedStore));
      } catch (e) {
        console.error('Erro ao carregar loja salva:', e);
      }
    }
    
    if (savedSalesperson) {
      try {
        setSelectedSalesperson(JSON.parse(savedSalesperson));
      } catch (e) {
        console.error('Erro ao carregar vendedor salvo:', e);
      }
    }
  }, []);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (selectedStore) {
      localStorage.setItem('selectedStore', JSON.stringify(selectedStore));
    } else {
      localStorage.removeItem('selectedStore');
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedSalesperson) {
      localStorage.setItem('selectedSalesperson', JSON.stringify(selectedSalesperson));
    } else {
      localStorage.removeItem('selectedSalesperson');
    }
  }, [selectedSalesperson]);

  const selectStore = (store: Store) => {
    setSelectedStore(store);
    setSelectedSalesperson(null); // Resetar vendedor ao mudar loja
    setError(null);
  };

  const detectStoreBySubdomain = () => {
    // Detectar subdomínio da URL
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Se tiver subdomínio (ex: piripiri.arruda-moveis.vercel.app)
    if (parts.length >= 3) {
      const subdomain = parts[0];
      const slug = SUBDOMAIN_MAP[subdomain];
      
      if (slug) {
        // Buscar loja pelo slug
        fetchStoresBySlug(slug);
      }
    }
  };

  const fetchStoresBySlug = async (slug: string) => {
    try {
      setIsLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://landmocp.onrender.com';
      const response = await fetch(`${API_BASE}/api/v1/locations/stores/slug/${slug}`);
      
      if (response.ok) {
        const store: Store = await response.json();
        selectStore(store);
      }
    } catch (e) {
      console.error('Erro ao buscar loja por slug:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const detectStoreByLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada neste navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Buscar loja mais próxima na API
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://landmocp.onrender.com';
      const response = await fetch(
        `${API_BASE}/api/v1/locations/stores/nearest?latitude=${latitude}&longitude=${longitude}`
      );

      if (response.ok) {
        const store: Store = await response.json();
        selectStore(store);
      } else {
        setError('Não foi possível encontrar uma loja próxima');
      }
    } catch (e) {
      setError('Não foi possível obter sua localização');
      console.error('Erro de geolocalização:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextSalesperson = async (storeId: number): Promise<Salesperson | null> => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://landmocp.onrender.com';
      const response = await fetch(`${API_BASE}/api/v1/locations/stores/${storeId}/next-salesperson`);
      
      if (response.ok) {
        const salesperson: Salesperson = await response.json();
        setSelectedSalesperson(salesperson);
        return salesperson;
      }
    } catch (e) {
      console.error('Erro ao buscar próximo vendedor:', e);
    }
    
    return null;
  };

  // Tentar detectar por subdomínio ao montar
  useEffect(() => {
    detectStoreBySubdomain();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        selectedStore,
        selectedSalesperson,
        isLoading,
        error,
        selectStore,
        detectStoreByLocation,
        detectStoreBySubdomain,
        getNextSalesperson,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de StoreProvider');
  }
  return context;
}
