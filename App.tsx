// App.tsx

import React from 'react';
import { BudgetProvider } from './src/context/BudgetContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <BudgetProvider>
      <AppNavigator />
    </BudgetProvider>
  );
}
