// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BudgetListScreen } from '../screens/BudgetListScreen';
import { BudgetFormScreen } from '../screens/BudgetFormScreen';
import { BudgetDetailScreen } from '../screens/BudgetDetailScreen';

export type RootStackParamList = {
  List: undefined;
  Form: { budgetId?: string } | undefined;
  Detail: { budgetId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="List" component={BudgetListScreen} />
        <Stack.Screen name="Form" component={BudgetFormScreen} />
        <Stack.Screen name="Detail" component={BudgetDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
