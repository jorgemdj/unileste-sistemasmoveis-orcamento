// /src/types/budget.ts

export enum BudgetStatus {
  DRAFT = 'Rascunho',
  SENT = 'Enviado',
  APPROVED = 'Aprovado',
  REJECTED = 'Recusado',
}

export interface ServiceItem {
  id: string; // para listas/renderização
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
  discount?: number; // percentual
  createdAt: string;
  updatedAt: string;
}