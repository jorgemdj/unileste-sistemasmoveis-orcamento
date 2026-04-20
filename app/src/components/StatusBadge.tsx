// /src/components/StatusBadge.tsx

import { Text, View } from 'react-native';
import { BudgetStatus } from '../types/budget';

const statusColors = {
  [BudgetStatus.DRAFT]: '#ccc',
  [BudgetStatus.SENT]: '#4dabf7',
  [BudgetStatus.APPROVED]: '#51cf66',
  [BudgetStatus.REJECTED]: '#ff6b6b',
};

export const StatusBadge = ({ status }: { status: BudgetStatus }) => {
  return (
    <View style={{
      backgroundColor: statusColors[status],
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    }}>
      <Text style={{ color: '#fff', fontSize: 12 }}>{status}</Text>
    </View>
  );
};