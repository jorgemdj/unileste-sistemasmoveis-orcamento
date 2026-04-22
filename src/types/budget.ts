// src/types/budget.ts

export enum BudgetStatus {
  DRAFT = 'Rascunho',
  SENT = 'Enviado',
  APPROVED = 'Aprovado',
  REJECTED = 'Recusado',
}

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  unitPrice: number; // em centavos
  quantity: number;
}

export interface Budget {
  id: string;
  title: string;
  client: string;
  status: BudgetStatus;
  items: ServiceItem[];
  discount?: number; // percentual 0-100
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
