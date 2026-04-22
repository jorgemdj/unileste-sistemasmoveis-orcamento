# Orçamentos App

Aplicativo mobile para gerenciamento de orçamentos de serviços, desenvolvido com **React Native + Expo SDK 54** e TypeScript. Using node v24.14.1 (npm v11.11.0)

---

## 🗂️ Estrutura do Projeto

```
src/
├── components/
│   ├── AppButton.tsx         # Botão reutilizável (primary / secondary / danger)
│   ├── AppInput.tsx          # Campo de entrada com suporte a label, prefixo e erro
│   ├── BudgetCard.tsx        # Card da listagem com ações (duplicar / excluir)
│   ├── ConfirmModal.tsx      # Modal de confirmação de ações críticas
│   ├── FilterBottomSheet.tsx # Bottom sheet de filtros e ordenação
│   ├── SectionCard.tsx       # Container de seção com título opcional
│   ├── ServiceBottomSheet.tsx# Bottom sheet para criar/editar serviço
│   ├── ServiceRow.tsx        # Linha de serviço (form + detalhe)
│   └── StatusBadge.tsx       # Badge colorido de status
├── context/
│   └── BudgetContext.tsx     # Estado global com CRUD completo
├── navigation/
│   └── AppNavigator.tsx      # Stack navigator (List → Detail → Form)
├── screens/
│   ├── BudgetListScreen.tsx  # Tela inicial — listagem + busca + filtros
│   ├── BudgetFormScreen.tsx  # Criação e edição de orçamento
│   └── BudgetDetailScreen.tsx# Visualização detalhada com ações
├── theme/
│   └── index.ts              # Cores, tipografia, espaçamentos e sombras
├── types/
│   └── budget.ts             # Interfaces e enums TypeScript
└── utils/
    └── currency.ts           # Formatação e cálculos monetários em centavos
App.tsx                       # Entry point com BudgetProvider
```

---

## 🚀 Como Rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npx expo start
```

### 3. Abrir no dispositivo

- **Expo Go** (iOS / Android): escaneie o QR code
- **Emulador Android**: pressione `a`
- **Simulador iOS**: pressione `i`

---

## 🎨 Design System

O projeto segue o Figma com:

| Token         | Valor         |
|---------------|---------------|
| purple-base   | `#6A46EB`     |
| purple-light  | `#DFDAF2`     |
| gray-700      | `#0F0F0F`     |
| danger-base   | `#DB4D4D`     |
| success-base  | `#4BB88A`     |
| info-base     | `#2AA1D9`     |
| Font          | System (Lato via Google Fonts opcional) |

---

## ✅ Funcionalidades

- [x] Listagem de orçamentos com busca por título/cliente
- [x] Filtros por status (múltipla seleção)
- [x] Ordenação (recente, antigo, maior/menor valor)
- [x] Criação de orçamento com validação
- [x] Edição de orçamento existente
- [x] Adição e edição de serviços com quantidade e valor
- [x] Cálculo automático de subtotal, desconto e total
- [x] Visualização detalhada do orçamento
- [x] Duplicar orçamento
- [x] Excluir com confirmação
- [x] Estado global via Context API
- [x] Componentes reutilizáveis com tipagem TypeScript
- [x] Hierarquia visual consistente com o Figma

---

## 📦 Dependências Principais

| Pacote                        | Versão   |
|-------------------------------|----------|
| expo                          | ~53.0.0  |
| react-native                  | 0.76.9   |
| @react-navigation/native      | ^6.x     |
| @react-navigation/native-stack| ^6.x     |
| @expo/vector-icons            | ^14.x    |
| react-native-screens          | ~4.4.0   |
| react-native-safe-area-context| 4.12.0   |
