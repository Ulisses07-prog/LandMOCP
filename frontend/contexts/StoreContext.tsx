'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Store, Salesperson } from '@/types/store';

export const OFFICIAL_STORES: Store[] = [
  {
    id: 1,
    name: 'Arruda Móveis - Piripiri (Matriz)',
    slug: 'piripiri',
    type: 'Matriz',
    city: 'Piripiri',
    state: 'PI',
    address: 'Rua 18 de Setembro, 970 – Centro, CEP 64.260-000',
    whatsapp_number: '5586981268763',
    latitude: -4.2719,
    longitude: -41.7769,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Arruda Móveis - Esperantina',
    slug: 'esperantina',
    type: 'Filial',
    city: 'Esperantina',
    state: 'PI',
    address: 'Rua Conrado Melo, nº 60 – Centro, CEP 64.180-000',
    whatsapp_number: '5586981906694',
    latitude: -3.9016,
    longitude: -42.2355,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Arruda Móveis - São José do Divino',
    slug: 'sao-jose-do-divino',
    type: 'Filial',
    city: 'São José do Divino',
    state: 'PI',
    address: 'Rua Manoel Divino, 265 – Centro, CEP 64.245-000',
    whatsapp_number: '5586981164886',
    latitude: -3.8055,
    longitude: -41.8286,
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Arruda Móveis - Joaquim Pires',
    slug: 'joaquim-pires',
    type: 'Filial',
    city: 'Joaquim Pires',
    state: 'PI',
    address: 'Rua José Pereira, nº 231 – Centro, CEP 64.170-000',
    whatsapp_number: '5586981888579',
    latitude: -3.5042,
    longitude: -42.1969,
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Arruda Móveis - Murici dos Portelas',
    slug: 'murici-dos-portelas',
    type: 'Filial',
    city: 'Murici dos Portelas',
    state: 'PI',
    address: 'Av. Lira Portela, 442 – Centro, CEP 64.175-000',
    whatsapp_number: '5586981423758',
    latitude: -3.3197,
    longitude: -42.0886,
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Arruda Móveis - Matias Olímpio',
    slug: 'matias-olimpio',
    type: 'Filial',
    city: 'Matias Olímpio',
    state: 'PI',
    address: 'Rua Francisco Maia, 230 – Centro, CEP 64.150-000',
    whatsapp_number: '5586981470568',
    latitude: -3.7161,
    longitude: -42.5486,
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'Arruda Móveis - São João do Arraial',
    slug: 'sao-joao-do-arraial',
    type: 'Filial',
    city: 'São João do Arraial',
    state: 'PI',
    address: 'Av. Vicente Augusto, 852 – Centro, CEP 64.155-000',
    whatsapp_number: '5586981551722',
    latitude: -3.8189,
    longitude: -42.4464,
    is_active: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'Arruda Móveis - Batalha',
    slug: 'batalha',
    type: 'Filial',
    city: 'Batalha',
    state: 'PI',
    address: 'Av. Cel Messias Melo, 483 – Centro, CEP 64.190-000',
    whatsapp_number: '5586999605864',
    latitude: -4.0264,
    longitude: -42.0792,
    is_active: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface StoreContextType {
  selectedStore: Store | null;
  selectedSalesperson: Salesperson | null;
  storesList: Store[];
  isLoading: boolean;
  error: string | null;
  isStoreModalOpen: boolean;
  openStoreModal: () => void;
  closeStoreModal: () => void;
  selectStore: (store: Store) => void;
  detectStoreByLocation: () => Promise<void>;
  detectStoreBySubdomain: () => void;
  getNextSalesperson: (storeId: number) => Promise<Salesperson | null>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const SUBDOMAIN_MAP: Record<string, string> = {
  piripiri: 'piripiri',
  'sao-jose': 'sao-jose-do-divino',
  batalha: 'batalha',
  esperantina: 'esperantina',
  joaquim: 'joaquim-pires',
  murici: 'murici-dos-portelas',
  'sao-joao': 'sao-joao-do-arraial',
  matias: 'matias-olimpio',
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(OFFICIAL_STORES[0]);
  const [selectedSalesperson, setSelectedSalesperson] = useState<Salesperson | null>(null);
  const [storesList, setStoresList] = useState<Store[]>(OFFICIAL_STORES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  const openStoreModal = () => setIsStoreModalOpen(true);
  const closeStoreModal = () => setIsStoreModalOpen(false);

  // Carregar lista de lojas do backend
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://landmocp.onrender.com';
        const res = await fetch(`${API_BASE}/api/v1/locations/stores`, { cache: 'no-store' });
        if (res.ok) {
          const data: Store[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStoresList(data);
          }
        }
      } catch (e) {
        // Fallback silencioso para OFFICIAL_STORES
      }
    };
    fetchStores();
  }, []);

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
    setSelectedSalesperson(null);
    setError(null);
    setIsStoreModalOpen(false);
  };

  const detectStoreBySubdomain = () => {
    if (typeof window === 'undefined') return;
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (parts.length >= 3) {
      const subdomain = parts[0].toLowerCase();
      const slug = SUBDOMAIN_MAP[subdomain];

      if (slug) {
        const found = storesList.find((s) => s.slug === slug);
        if (found) {
          selectStore(found);
        }
      }
    }
  };

  const detectStoreByLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
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

      // Calcular a loja mais próxima usando lista local ou API
      let closestStore = storesList[0];
      let minDistance = Infinity;

      storesList.forEach((store) => {
        if (store.latitude && store.longitude) {
          const R = 6371;
          const dLat = ((store.latitude - latitude) * Math.PI) / 180;
          const dLon = ((store.longitude - longitude) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((latitude * Math.PI) / 180) *
              Math.cos((store.latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          if (distance < minDistance) {
            minDistance = distance;
            closestStore = store;
          }
        }
      });

      if (closestStore) {
        selectStore(closestStore);
      }
    } catch (e) {
      setError('Não foi possível obter sua localização. Escolha sua cidade na lista.');
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

  useEffect(() => {
    detectStoreBySubdomain();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        selectedStore,
        selectedSalesperson,
        storesList,
        isLoading,
        error,
        isStoreModalOpen,
        openStoreModal,
        closeStoreModal,
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
