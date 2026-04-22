// src/screens/BudgetFormScreen.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useBudgetContext } from '../context/BudgetContext';
import { ServiceBottomSheet } from '../components/ServiceBottomSheet';
import { ServiceRow } from '../components/ServiceRow';
import { SectionCard } from '../components/SectionCard';
import { AppInput } from '../components/AppInput';
import { AppButton } from '../components/AppButton';
import { StatusBadge } from '../components/StatusBadge';
import { Budget, BudgetStatus, ServiceItem } from '../types/budget';
import {
  formatCurrency,
  calcSubtotal,
  applyDiscount,
  parseCurrencyToCents,
} from '../utils/currency';
import { Colors, Typography, Spacing, Radii } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavRoute = RouteProp<RootStackParamList, 'Form'>;

const ALL_STATUSES = [
  BudgetStatus.DRAFT,
  BudgetStatus.SENT,
  BudgetStatus.APPROVED,
  BudgetStatus.REJECTED,
];

export const BudgetFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<NavRoute>();
  const { addBudget, updateBudget, getBudget } = useBudgetContext();

  const existingId = route.params?.budgetId;
  const existing = existingId ? getBudget(existingId) : undefined;

  // ── Form state ──────────────────────────────────────────────────
  const [title, setTitle] = useState(existing?.title ?? '');
  const [client, setClient] = useState(existing?.client ?? '');
  const [status, setStatus] = useState<BudgetStatus>(existing?.status ?? BudgetStatus.DRAFT);
  const [items, setItems] = useState<ServiceItem[]>(existing?.items ?? []);
  const [discountText, setDiscountText] = useState(String(existing?.discount ?? '0'));
  const [serviceVisible, setServiceVisible] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Validation errors
  const [titleError, setTitleError] = useState('');
  const [clientError, setClientError] = useState('');

  // ── Calculations ────────────────────────────────────────────────
  const discountPct = useMemo(() => {
    const v = parseFloat(discountText.replace(',', '.'));
    return isNaN(v) ? 0 : Math.min(Math.max(v, 0), 100);
  }, [discountText]);

  const subtotal = useMemo(() => calcSubtotal(items), [items]);
  const discountAmount = useMemo(
    () => Math.round(subtotal * (discountPct / 100)),
    [subtotal, discountPct],
  );
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  // ── Service handlers ────────────────────────────────────────────
  const handleSaveService = (service: ServiceItem) => {
    if (editingService) {
      setItems(prev => prev.map(i => (i.id === service.id ? service : i)));
    } else {
      setItems(prev => [...prev, service]);
    }
    setEditingService(null);
  };

  const openEdit = (item: ServiceItem) => {
    setEditingService(item);
    setServiceVisible(true);
  };

  // ── Save ────────────────────────────────────────────────────────
  const validate = (): boolean => {
    let ok = true;
    if (!title.trim()) {
      setTitleError('Informe o título do orçamento');
      ok = false;
    } else {
      setTitleError('');
    }
    if (!client.trim()) {
      setClientError('Informe o nome do cliente');
      ok = false;
    } else {
      setClientError('');
    }
    return ok;
  };

  const handleSave = () => {
    if (!validate()) return;

    const now = new Date().toISOString();
    const budget: Budget = {
      id: existing?.id ?? Date.now().toString(),
      title: title.trim(),
      client: client.trim(),
      status,
      items,
      discount: discountPct,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (existing) {
      updateBudget(budget);
    } else {
      addBudget(budget);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── NAV ──────────────────────────────────── */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={20} color={Colors.textPrimary} />
            <Text style={styles.backLabel}>Orçamento</Text>
          </TouchableOpacity>

          {/* ── GENERAL INFO ─────────────────────────── */}
          <SectionCard title="Informações gerais" iconName="tag">
            <AppInput
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
              error={titleError}
              returnKeyType="next"
            />
            <AppInput
              placeholder="Cliente"
              value={client}
              onChangeText={setClient}
              error={clientError}
              containerStyle={{ marginBottom: 0 }}
              returnKeyType="done"
            />
          </SectionCard>

          {/* ── STATUS ───────────────────────────────── */}
          <SectionCard title="Status" iconName="tag">
            <View style={styles.statusGrid}>
              {ALL_STATUSES.map(s => {
                const selected = status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setStatus(s)}
                    style={styles.statusOption}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterSelected,
                      ]}
                    >
                      {selected && <View style={styles.radioDot} />}
                    </View>
                    <StatusBadge status={s} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </SectionCard>

          {/* ── SERVICES ─────────────────────────────── */}
          <SectionCard title="Serviços inclusos" iconName="tag">
            {items.map(item => (
              <ServiceRow
                key={item.id}
                item={item}
                onEdit={() => openEdit(item)}
              />
            ))}

            <TouchableOpacity
              onPress={() => {
                setEditingService(null);
                setServiceVisible(true);
              }}
              style={styles.addServiceBtn}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={16} color={Colors.purpleBase} />
              <Text style={styles.addServiceLabel}>Adicionar serviço</Text>
            </TouchableOpacity>
          </SectionCard>

          {/* ── INVESTMENT ───────────────────────────── */}
          <SectionCard title="Investimento" iconName="tag">
            {/* Subtotal row */}
            <View style={styles.investRow}>
              <Text style={styles.investLabel}>
                Subtotal{' '}
                <Text style={styles.investItemCount}>
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </Text>
              </Text>
              <Text style={styles.investValue}>{formatCurrency(subtotal)}</Text>
            </View>

            {/* Discount input */}
            <View style={styles.discountRow}>
              <Text style={styles.investLabel}>Desconto</Text>
              <View style={styles.discountInput}>
                <AppInput
                  value={discountText}
                  onChangeText={setDiscountText}
                  keyboardType="decimal-pad"
                  containerStyle={{ marginBottom: 0, width: 42 }}
                />
                <Text style={styles.discountPct}>%</Text>
              </View>
            </View>

            {discountPct > 0 && (
              <View style={styles.investRow}>
                <Text style={styles.discountLabel}>Desconto aplicado</Text>
                <Text style={styles.discountValue}>- {formatCurrency(discountAmount)}</Text>
              </View>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.investRow}>
              <Text style={styles.totalLabel}>Valor total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </SectionCard>

          {/* ── FOOTER BUTTONS ───────────────────────── */}
          <View style={styles.footer}>
            <AppButton
              label="Cancelar"
              onPress={() => navigation.goBack()}
              variant="secondary"
              style={styles.footerBtn}
            />
            <AppButton
              label="Salvar"
              onPress={handleSave}
              variant="primary"
              icon={<Feather name="check" size={16} color={Colors.white} />}
              style={styles.footerBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ServiceBottomSheet
        visible={serviceVisible}
        onClose={() => {
          setServiceVisible(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        initialService={editingService}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: Spacing.xl,
  },
  backLabel: {
    ...Typography.textSm,
    color: Colors.textPrimary,
  },
  statusGrid: {
    gap: Spacing.md,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.gray400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.purpleBase,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.purpleBase,
  },
  addServiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  addServiceLabel: {
    ...Typography.titleXs,
    color: Colors.purpleBase,
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
  investItemCount: {
    color: Colors.textDisabled,
  },
  investValue: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  discountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountField: {
    width: 72,
    textAlign: 'right',
  },
  discountPct: {
    ...Typography.textSm,
    color: Colors.textSecondary,
  },
  discountLabel: {
    ...Typography.textSm,
    color: Colors.textSecondary,
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
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footerBtn: {
    flex: 1,
  },
});
