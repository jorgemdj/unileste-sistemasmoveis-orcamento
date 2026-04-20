// /src/screens/BudgetListScreen.tsx

import { View, FlatList, TextInput, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { BudgetCard } from '../components/BudgetCard';
import { useBudgets } from '../hooks/useBudgets';
import { Feather } from '@expo/vector-icons';
import { FilterBottomSheet } from '../components/FilterBottomSheet';

export const BudgetListScreen = () => {
  const { budgets } = useBudgets();
  const [search, setSearch] = useState('');

  const filtered = budgets.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.client.toLowerCase().includes(search.toLowerCase())
  );

  const drafts = budgets.filter(b => b.status === 'Rascunho').length;

  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View style={{ flex: 1, marginTop: 50, padding: 16, backgroundColor: '#ffffff' }}>

      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            Orçamentos
          </Text>
          <Text style={{ color: '#666', marginTop: 4 }}>
            Você tem {drafts} item em rascunho.
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#0080e8',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            + Novo
          </Text>
        </TouchableOpacity>
      </View>

      {/* BUSCA + FILTRO */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <TextInput
          placeholder="Título ou cliente"
          value={search}
          onChangeText={setSearch}
          style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            padding: 12,
            borderRadius: 12,
          }}
        />

        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={{
            marginLeft: 8,
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="filter" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BudgetCard
            budget={item}
            onPress={() => {}}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
};