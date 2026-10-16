export interface Store {
  id: number;
  name: string;
  slug: string;
  type: 'Matriz' | 'Filial';
  city: string;
  state: string;
  address?: string;
  whatsapp_number: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  salespeople?: Salesperson[];
}

export interface Salesperson {
  id: number;
  store_id: number;
  name: string;
  whatsapp_number: string;
  is_active: boolean;
  assignment_count: number;
  created_at: string;
  updated_at: string;
}

export interface StoreWithSalespeople extends Store {
  salespeople: Salesperson[];
}
