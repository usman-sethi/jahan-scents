import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SalesEntry {
  id: string;
  date: string;
  totalSales: number;
  expenses: number;
  productCost: number;
  notes?: string;
}

interface CashManagementState {
  entries: SalesEntry[];
  addEntry: (entry: Omit<SalesEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<SalesEntry>) => void;
  deleteEntry: (id: string) => void;
}

const generateMockData = () => {
  const data: SalesEntry[] = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Random variations
    const sales = 1500 + Math.random() * 2000; 
    const expenses = 200 + Math.random() * 300;
    const cost = sales * 0.35 + Math.random() * 100;
    
    data.push({
      id: Math.random().toString(36).substring(2, 9),
      date: d.toISOString().split('T')[0],
      totalSales: Math.round(sales),
      expenses: Math.round(expenses),
      productCost: Math.round(cost),
      notes: Math.random() > 0.8 ? 'Event day' : ''
    });
  }
  return data;
};

export const useCashManagementStore = create<CashManagementState>()(
  persist(
    (set) => ({
      entries: generateMockData(),
      addEntry: (entry) => set((state) => ({
        entries: [
          ...state.entries, 
          { ...entry, id: Math.random().toString(36).substring(2, 9) }
        ]
      })),
      updateEntry: (id, updated) => set((state) => ({
        entries: state.entries.map((e) => e.id === id ? { ...e, ...updated } : e)
      })),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((e) => e.id !== id)
      }))
    }),
    {
      name: 'cash-mgmt-store'
    }
  )
);
