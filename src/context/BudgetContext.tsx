// src/context/BudgetContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Budget, BudgetStatus } from '../types/budget';

// ─── Seed data ────────────────────────────────────────────────────────────────

const now = new Date();
const daysAgo = (d: number) =>
  new Date(now.getTime() - 1000 * 60 * 60 * 24 * d).toISOString();

const INITIAL_BUDGETS: Budget[] = [
  {
    id: '1',
    title: 'Desenvolvimento de aplicativo de loja online',
    client: 'Soluções Tecnológicas Beta',
    status: BudgetStatus.APPROVED,
    discount: 5,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    items: [
      { id: '1a', title: 'Design de interfaces', description: 'Criação de wireframes e protótipos de alta fidelidade', unitPrice: 384750, quantity: 1 },
      { id: '1b', title: 'Desenvolvimento front-end', description: 'Criação de interfaces de usuário interativas', unitPrice: 384750, quantity: 1 },
      { id: '1c', title: 'Desenvolvimento back-end', description: 'Implementação de servidor, banco de dados e APIs', unitPrice: 384750, quantity: 1 },
      { id: '1d', title: 'Implantação e suporte', description: 'Publicação nas lojas de aplicativos e suporte técnico', unitPrice: 384750, quantity: 1 },
    ],
  },
  {
    id: '2',
    title: 'Consultoria em marketing digital',
    client: 'Marketing Wizards',
    status: BudgetStatus.DRAFT,
    discount: 0,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
    items: [
      { id: '2a', title: 'Auditoria de SEO', unitPrice: 150000, quantity: 1 },
      { id: '2b', title: 'Gestão de campanhas', unitPrice: 250000, quantity: 1 },
    ],
  },
  {
    id: '3',
    title: 'Serviços de SEO',
    client: 'SEO Masters',
    status: BudgetStatus.SENT,
    discount: 0,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    items: [
      { id: '3a', title: 'Otimização on-page', unitPrice: 200000, quantity: 1 },
      { id: '3b', title: 'Link building', unitPrice: 150000, quantity: 1 },
    ],
  },
  {
    id: '4',
    title: 'Criação de conteúdo',
    client: 'Content Creators',
    status: BudgetStatus.DRAFT,
    discount: 10,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(8),
    items: [
      { id: '4a', title: 'Redação de artigos', unitPrice: 80000, quantity: 2 },
      { id: '4b', title: 'Design gráfico', unitPrice: 90000, quantity: 1 },
    ],
  },
  {
    id: '5',
    title: 'Gestão de redes sociais',
    client: 'Social Experts',
    status: BudgetStatus.REJECTED,
    discount: 0,
    createdAt: daysAgo(20),
    updatedAt: daysAgo(12),
    items: [
      { id: '5a', title: 'Gestão mensal', unitPrice: 180000, quantity: 1 },
    ],
  },
  {
    id: '6',
    title: 'Design de interface',
    client: 'UI/UX Designers',
    status: BudgetStatus.APPROVED,
    discount: 0,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
    items: [
      { id: '6a', title: 'Sistema de design', unitPrice: 300000, quantity: 1 },
      { id: '6b', title: 'Prototipagem', unitPrice: 220000, quantity: 1 },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface BudgetContextData {
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  duplicateBudget: (id: string) => void;
  getBudget: (id: string) => Budget | undefined;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const BudgetContext = createContext<BudgetContextData>({} as BudgetContextData);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);

  const addBudget = useCallback((budget: Budget) => {
    setBudgets(prev => [budget, ...prev]);
  }, []);

  const updateBudget = useCallback((budget: Budget) => {
    setBudgets(prev => prev.map(b => (b.id === budget.id ? budget : b)));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);

  const duplicateBudget = useCallback((id: string) => {
    setBudgets(prev => {
      const original = prev.find(b => b.id === id);
      if (!original) return prev;
      const copy: Budget = {
        ...original,
        id: Date.now().toString(),
        title: `${original.title} (cópia)`,
        status: BudgetStatus.DRAFT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: original.items.map(item => ({ ...item, id: `${Date.now()}-${item.id}` })),
      };
      return [copy, ...prev];
    });
  }, []);

  const getBudget = useCallback(
    (id: string) => budgets.find(b => b.id === id),
    [budgets],
  );

  return (
    <BudgetContext.Provider
      value={{ budgets, addBudget, updateBudget, deleteBudget, duplicateBudget, getBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = (): BudgetContextData => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudgetContext must be used within BudgetProvider');
  return ctx;
};
