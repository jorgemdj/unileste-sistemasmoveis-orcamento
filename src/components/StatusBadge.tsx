// src/components/StatusBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BudgetStatus } from '../types/budget';
import { Typography } from '../theme';

interface StatusConfig {
  dot: string;
  bg: string;
  text: string;
  label: string;
}

const STATUS_CONFIG: Record<BudgetStatus, StatusConfig> = {
  [BudgetStatus.DRAFT]: {
    dot: '#A1A2A1',
    bg: '#F0F0F0',
    text: '#676767',
    label: 'Rascunho',
  },
  [BudgetStatus.SENT]: {
    dot: '#2AA1D9',
    bg: '#CEEFFF',
    text: '#1D7096',
    label: 'Enviado',
  },
  [BudgetStatus.APPROVED]: {
    dot: '#4BB88A',
    bg: '#BFF7BE',
    text: '#30752F',
    label: 'Aprovado',
  },
  [BudgetStatus.REJECTED]: {
    dot: '#DB4D4D',
    bg: '#FFD6D6',
    text: '#9E4949',
    label: 'Recusado',
  },
};

interface Props {
  status: BudgetStatus;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...Typography.textXs,
    fontWeight: '600',
  },
});
