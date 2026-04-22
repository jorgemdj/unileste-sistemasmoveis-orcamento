// src/components/ServiceRow.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ServiceItem } from '../types/budget';
import { formatCurrency } from '../utils/currency';
import { Colors, Typography, Spacing, Radii } from '../theme';

interface Props {
  item: ServiceItem;
  onEdit?: () => void;
  readOnly?: boolean;
}

export const ServiceRow: React.FC<Props> = ({ item, onEdit, readOnly = false }) => {
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>{formatCurrency(lineTotal)}</Text>
        <Text style={styles.qty}>Qt: {item.quantity}</Text>
      </View>

      {!readOnly && onEdit ? (
        <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
          <Feather name="edit-2" size={14} color={Colors.purpleBase} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    ...Typography.titleXs,
    color: Colors.textPrimary,
  },
  description: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  price: {
    ...Typography.titleXs,
    color: Colors.textPrimary,
  },
  qty: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    padding: Spacing.xs,
    marginTop: 2,
  },
});
