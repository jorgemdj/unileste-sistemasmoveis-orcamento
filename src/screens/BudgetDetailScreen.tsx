// src/screens/BudgetDetailScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useBudgetContext } from '../context/BudgetContext';
import { StatusBadge } from '../components/StatusBadge';
import { ServiceRow } from '../components/ServiceRow';
import { SectionCard } from '../components/SectionCard';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  formatCurrency,
  calcSubtotal,
  applyDiscount,
} from '../utils/currency';
import { Colors, Typography, Spacing, Radii, Shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Detail'>;
type NavRoute = RouteProp<RootStackParamList, 'Detail'>;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const BudgetDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<NavRoute>();
  const { getBudget, deleteBudget, duplicateBudget } = useBudgetContext();

  const budget = getBudget(route.params.budgetId);
  const [deleteVisible, setDeleteVisible] = useState(false);

  if (!budget) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Orçamento não encontrado.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: Colors.purpleBase }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const subtotal = calcSubtotal(budget.items);
  const discountAmount = budget.discount
    ? Math.round(subtotal * (budget.discount / 100))
    : 0;
  const total = subtotal - discountAmount;

  const handleDelete = () => {
    deleteBudget(budget.id);
    navigation.popToTop();
  };

  const handleDuplicate = () => {
    duplicateBudget(budget.id);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── TOP NAVIGATION ──────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={20} color={Colors.textPrimary} />
          <Text style={styles.backLabel}>Orçamento</Text>
        </TouchableOpacity>

        <StatusBadge status={budget.status} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO CARD ───────────────────────────── */}
        <SectionCard>
          <Text style={styles.budgetTitle}>{budget.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Cliente</Text>
            <Text style={styles.metaValue}>{budget.client}</Text>
          </View>

          <View style={styles.datesRow}>
            <View>
              <Text style={styles.metaLabel}>Criado em</Text>
              <Text style={styles.metaValue}>{formatDate(budget.createdAt)}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Atualizado em</Text>
              <Text style={styles.metaValue}>{formatDate(budget.updatedAt)}</Text>
            </View>
          </View>
        </SectionCard>

        {/* ── SERVICES ────────────────────────────── */}
        <SectionCard title="Serviços inclusos" iconName="tag">
          {budget.items.map(item => (
            <ServiceRow key={item.id} item={item} readOnly />
          ))}
        </SectionCard>

        {/* ── INVESTMENT ──────────────────────────── */}
        <SectionCard title="Investimento" iconName="tag">
          <View style={styles.investRow}>
            <Text style={styles.investLabel}>Subtotal</Text>
            <Text style={styles.investValue}>{formatCurrency(subtotal)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.investRow}>
              <View style={styles.discountLabelRow}>
                <Text style={styles.investLabel}>Desconto</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>{budget.discount}% off</Text>
                </View>
              </View>
              <Text style={styles.discountValue}>- {formatCurrency(discountAmount)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.investRow}>
            <Text style={styles.totalLabel}>Investimento total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </SectionCard>
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ────────────────────── */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          onPress={() => setDeleteVisible(true)}
          style={styles.iconAction}
        >
          <Feather name="trash-2" size={20} color={Colors.dangerBase} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDuplicate}
          style={styles.iconAction}
        >
          <Feather name="copy" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Form', { budgetId: budget.id })}
          style={styles.iconAction}
        >
          <Feather name="edit-2" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
          <Feather name="send" size={16} color={Colors.white} />
          <Text style={styles.shareBtnLabel}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={deleteVisible}
        title="Excluir orçamento"
        message="Essa ação não pode ser desfeita. Deseja realmente excluir este orçamento?"
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backLabel: {
    ...Typography.textSm,
    color: Colors.textPrimary,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  budgetTitle: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  metaRow: {
    marginBottom: Spacing.sm,
  },
  metaLabel: {
    ...Typography.textXs,
    color: Colors.textSecondary,
  },
  metaValue: {
    ...Typography.textSm,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  datesRow: {
    flexDirection: 'row',
    gap: Spacing.xxxl,
    marginTop: Spacing.sm,
  },
  investRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  investLabel: {
    ...Typography.textSm,
    color: Colors.textSecondary,
  },
  investValue: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
  },
  discountLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  discountBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  discountBadgeText: {
    ...Typography.textXs,
    color: Colors.successDark,
    fontWeight: '600',
  },
  discountValue: {
    ...Typography.textSm,
    color: Colors.dangerBase,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
  },
  totalValue: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  iconAction: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.purpleBase,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
    gap: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  shareBtnLabel: {
    ...Typography.titleSm,
    color: Colors.white,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notFoundText: {
    ...Typography.textMd,
    color: Colors.textSecondary,
  },
});
