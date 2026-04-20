// /src/components/BudgetCard.tsx

import { View, Text, TouchableOpacity } from 'react-native';
import { Budget } from '../types/budget';
import { formatCurrency } from '../utils/currency';
import { StatusBadge } from './StatusBadge';

interface Props {
  budget: Budget;
  onPress: () => void;
}

export const BudgetCard = ({ budget, onPress }: Props) => {
  const total = budget.items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const discountedTotal = budget.discount
    ? total * (1 - budget.discount / 100)
    : total;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        marginBottom: 12,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold' }}>{budget.title}</Text>
          <StatusBadge status={budget.status} />
        </View>

        <Text style={{ color: '#666', marginTop: 4 }}>
          {budget.client}
        </Text>

        <Text style={{ marginTop: 8, fontWeight: 'bold' }}>
          {formatCurrency(discountedTotal)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};