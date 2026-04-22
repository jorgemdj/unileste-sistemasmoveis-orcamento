// src/components/FilterBottomSheet.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BudgetStatus } from '../types/budget';
import { StatusBadge } from './StatusBadge';
import { AppButton } from './AppButton';
import { Colors, Typography, Spacing, Radii } from '../theme';

export type SortOption = 'recent' | 'oldest' | 'price_desc' | 'price_asc';

export interface FilterState {
  statuses: BudgetStatus[];
  sort: SortOption;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Mais recente', value: 'recent' },
  { label: 'Mais antigo', value: 'oldest' },
  { label: 'Maior valor', value: 'price_desc' },
  { label: 'Menor valor', value: 'price_asc' },
];

const ALL_STATUSES = [
  BudgetStatus.DRAFT,
  BudgetStatus.SENT,
  BudgetStatus.APPROVED,
  BudgetStatus.REJECTED,
];

export const FilterBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  filters,
  onApply,
}) => {
  const [localStatuses, setLocalStatuses] = useState<BudgetStatus[]>(filters.statuses);
  const [localSort, setLocalSort] = useState<SortOption>(filters.sort);

  // Sync when opening
  useEffect(() => {
    if (visible) {
      setLocalStatuses(filters.statuses);
      setLocalSort(filters.sort);
    }
  }, [visible, filters]);

  const toggleStatus = (status: BudgetStatus) => {
    setLocalStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status],
    );
  };

  const handleReset = () => {
    setLocalStatuses([]);
    setLocalSort('recent');
  };

  const handleApply = () => {
    onApply({ statuses: localStatuses, sort: localSort });
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View
          style={styles.sheet}
          onStartShouldSetResponder={() => true}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filtrar e ordenar</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* STATUS */}
            <Text style={styles.sectionTitle}>Status</Text>

            {ALL_STATUSES.map(status => {
              const checked = localStatuses.includes(status);
              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => toggleStatus(status)}
                  style={styles.optionRow}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, checked && styles.checkboxSelected]}>
                    {checked && <Feather name="check" size={12} color={Colors.white} />}
                  </View>
                  <StatusBadge status={status} />
                </TouchableOpacity>
              );
            })}

            {/* SORT */}
            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Ordenação</Text>

            {SORT_OPTIONS.map(option => {
              const selected = localSort === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setLocalSort(option.value)}
                  style={styles.optionRow}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <AppButton
              label="Resetar filtros"
              onPress={handleReset}
              variant="secondary"
              style={styles.actionBtn}
            />
            <AppButton
              label="Aplicar"
              onPress={handleApply}
              variant="primary"
              icon={<Feather name="check" size={16} color={Colors.white} />}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.gray400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    backgroundColor: Colors.purpleBase,
    borderColor: Colors.purpleBase,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.gray400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  radioSelected: {
    borderColor: Colors.purpleBase,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.purpleBase,
  },
  optionLabel: {
    ...Typography.textSm,
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  actionBtn: {
    flex: 1,
  },
});
