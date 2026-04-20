// /src/hooks/useBudgets.ts

import { useState } from 'react';
import { Budget, BudgetStatus } from '../types/budget';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      title: 'Desenvolvimento de app',
      client: 'Empresa X',
      status: BudgetStatus.APPROVED,
      discount: 10,
      createdAt: '',
      updatedAt: '',
      items: [
        { id: '1', title: 'App', unitPrice: 2000000, quantity: 1 },
      ],
    },
    {
      id: '2',
      title: 'Consultoria em marketing digital',
      client: 'Marketing Wizards',
      status: BudgetStatus.DRAFT,
      discount: 5,
      createdAt: '',
      updatedAt: '',
      items: [
        { id: '1', title: 'App', unitPrice: 2000000, quantity: 1 },
      ],
    },
    {
      id: '3',
      title: 'Servicos de SEO',
      client: 'SEO Masters',
      status: BudgetStatus.SENT,
      discount: 7,
      createdAt: '',
      updatedAt: '',
      items: [
        { id: '1', title: 'App', unitPrice: 2000000, quantity: 1 },
      ],
    },
    {
      id: '4',
      title: 'Criacao de conteudo',
      client: 'Content Creators',
      status: BudgetStatus.DRAFT,
      discount: 2,
      createdAt: '',
      updatedAt: '',
      items: [
        { id: '1', title: 'App', unitPrice: 2000000, quantity: 1 },
      ],
    },
  ]);

  return {
    budgets,
    setBudgets,
  };
};