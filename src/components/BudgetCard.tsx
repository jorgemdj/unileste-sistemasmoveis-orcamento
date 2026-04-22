// src/components/BudgetCard.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Budget } from '../types/budget';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, calcSubtotal, applyDiscount } from '../utils/currency';
import { Colors, Typography, Spacing, Radii, Shadow } from '../theme';

interface Props {
  budget: Budget;
  onPress: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const BudgetCard: React.FC<Props> = ({
  budget,
  onPress,
  onDuplicate,
  onDelete,
}) => {
  const subtotal = calcSubtotal(budget.items);
  const total = budget.discount ? applyDiscount(subtotal, budget.discount) : subtotal;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.card, Shadow.card]}
    >
      {/* Top row: title + status */}
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>
          {budget.title}
        </Text>
        <StatusBadge status={budget.status} />
      </View>

      {/* Client */}
      <Text style={styles.client} numberOfLines={1}>
        {budget.client}
      </Text>

      {/* Bottom row: value + actions */}
      <View style={styles.bottomRow}>
        <Text style={styles.total}>{formatCurrency(total)}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onDuplicate}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.actionBtn}
          >
            <Feather name="copy" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.actionBtn}
          >
            <Feather name="trash-2" size={16} color={Colors.dangerBase} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
    flex: 1,
  },
  client: {
    ...Typography.textSm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionBtn: {
    padding: Spacing.xs,
  },
});
