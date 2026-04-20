// /src/components/FilterBottomSheet.tsx

import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BudgetStatus } from '../types/budget';
import { StatusBadge } from './StatusBadge';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const FilterBottomSheet = ({ visible, onClose }: Props) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      {/* Overlay */}
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
      }}>

        {/* Sheet */}
        <View style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 16,
          maxHeight: '80%',
        }}>

          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Filtrar e ordenar
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* STATUS */}
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
            Status
          </Text>

          {[ 
            BudgetStatus.DRAFT,
            BudgetStatus.SENT,
            BudgetStatus.APPROVED,
            BudgetStatus.REJECTED,
          ].map((status) => (
            <View
              key={status}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1,
                marginRight: 10,
              }} />

              <StatusBadge status={status} />
            </View>
          ))}

          {/* ORDENAR */}
          <Text style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
            Ordenar por
          </Text>

          {[
            'Mais recente',
            'Mais antigo',
            'Valor crescente',
            'Valor decrescente',
          ].map((option) => (
            <View
              key={option}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1,
                marginRight: 10,
              }} />

              <Text>{option}</Text>
            </View>
          ))}

          {/* BOTÕES */}
          <View style={{
            flexDirection: 'row',
            marginTop: 24,
            gap: 10,
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#6c5ce7',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#6c5ce7', fontWeight: 'bold' }}>
                Resetar filtros
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                backgroundColor: '#6c5ce7',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                Aplicar
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};