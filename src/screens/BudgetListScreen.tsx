// src/screens/BudgetListScreen.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useBudgetContext } from '../context/BudgetContext';
import { BudgetCard } from '../components/BudgetCard';
import { FilterBottomSheet, FilterState } from '../components/FilterBottomSheet';
import { ConfirmModal } from '../components/ConfirmModal';
import { Budget, BudgetStatus } from '../types/budget';
import { calcSubtotal, applyDiscount } from '../utils/currency';
import { Colors, Typography, Spacing, Radii } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'List'>;

const getBudgetTotal = (b: Budget) => {
  const sub = calcSubtotal(b.items);
  return b.discount ? applyDiscount(sub, b.discount) : sub;
};

export const BudgetListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { budgets, deleteBudget, duplicateBudget } = useBudgetContext();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({ statuses: [], sort: 'recent' });
  const [filterVisible, setFilterVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const draftCount = useMemo(
    () => budgets.filter(b => b.status === BudgetStatus.DRAFT).length,
    [budgets],
  );

  const processed = useMemo(() => {
    const q = search.toLowerCase();
    return budgets
      .filter(b =>
        b.title.toLowerCase().includes(q) || b.client.toLowerCase().includes(q),
      )
      .filter(
        b => filters.statuses.length === 0 || filters.statuses.includes(b.status),
      )
      .sort((a, b2) => {
        switch (filters.sort) {
          case 'recent':
            return new Date(b2.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b2.createdAt).getTime();
          case 'price_desc':
            return getBudgetTotal(b2) - getBudgetTotal(a);
          case 'price_asc':
            return getBudgetTotal(a) - getBudgetTotal(b2);
          default:
            return 0;
        }
      });
  }, [budgets, search, filters]);

  const hasActiveFilters = filters.statuses.length > 0 || filters.sort !== 'recent';

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteBudget(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.container}>

        {/* ── HEADER ─────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Orçamentos</Text>
            {draftCount > 0 && (
              <Text style={styles.headerSubtitle}>
                Você tem {draftCount} {draftCount === 1 ? 'item' : 'itens'} em rascunho
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Form', {})}
            style={styles.newBtn}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={16} color={Colors.white} />
            <Text style={styles.newBtnLabel}>Novo</Text>
          </TouchableOpacity>
        </View>

        {/* ── SEARCH + FILTER ────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={16} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Título ou cliente"
              placeholderTextColor={Colors.textDisabled}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Feather name="x" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
            activeOpacity={0.75}
          >
            <Feather
              name="sliders"
              size={18}
              color={hasActiveFilters ? Colors.purpleBase : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* ── ACTIVE FILTERS HINT ───────────────────── */}
        {hasActiveFilters && (
          <TouchableOpacity
            onPress={() => setFilters({ statuses: [], sort: 'recent' })}
            style={styles.filtersHint}
          >
            <Feather name="x-circle" size={14} color={Colors.purpleBase} />
            <Text style={styles.filtersHintText}>Limpar filtros</Text>
          </TouchableOpacity>
        )}

        {/* ── LIST ──────────────────────────────────── */}
        <FlatList
          data={processed}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <BudgetCard
              budget={item}
              onPress={() => navigation.navigate('Detail', { budgetId: item.id })}
              onDuplicate={() => duplicateBudget(item.id)}
              onDelete={() => setDeleteTarget(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="file-text" size={48} color={Colors.gray300} />
              <Text style={styles.emptyTitle}>Nenhum orçamento</Text>
              <Text style={styles.emptySubtitle}>
                {search || hasActiveFilters
                  ? 'Nenhum resultado para os filtros aplicados'
                  : 'Crie seu primeiro orçamento'}
              </Text>
            </View>
          }
        />
      </View>

      {/* ── MODALS ────────────────────────────────────── */}
      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onApply={setFilters}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Excluir orçamento"
        message="Essa ação não pode ser desfeita. Deseja realmente excluir este orçamento?"
        confirmLabel="Excluir"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.titleLg,
    fontSize: 22,
    color: Colors.purpleBase,
  },
  headerSubtitle: {
    ...Typography.textXs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purpleBase,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
    gap: Spacing.xs,
  },
  newBtnLabel: {
    ...Typography.titleXs,
    color: Colors.white,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 44,
    gap: Spacing.xs,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    ...Typography.textSm,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    borderColor: Colors.purpleBase,
    backgroundColor: Colors.purpleLight,
  },
  filtersHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  filtersHintText: {
    ...Typography.textXs,
    color: Colors.purpleBase,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.titleMd,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.textSm,
    color: Colors.textDisabled,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
});
