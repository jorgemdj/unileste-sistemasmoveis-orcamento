// src/components/ServiceBottomSheet.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ServiceItem } from '../types/budget';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';
import { Colors, Typography, Spacing, Radii } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (service: ServiceItem) => void;
  /** Pass an existing service to edit it */
  initialService?: ServiceItem | null;
}

export const ServiceBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSave,
  initialService,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [titleError, setTitleError] = useState('');
  const [priceError, setPriceError] = useState('');

  // Reset / populate on open
  useEffect(() => {
    if (visible) {
      if (initialService) {
        setTitle(initialService.title);
        setDescription(initialService.description ?? '');
        setPrice((initialService.unitPrice / 100).toFixed(2).replace('.', ','));
        setQuantity(initialService.quantity);
      } else {
        setTitle('');
        setDescription('');
        setPrice('');
        setQuantity(1);
      }
      setTitleError('');
      setPriceError('');
    }
  }, [visible, initialService]);

  const validate = (): boolean => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Informe o nome do serviço');
      valid = false;
    } else {
      setTitleError('');
    }
    const numericPrice = parseFloat(price.replace(',', '.'));
    if (!price || isNaN(numericPrice) || numericPrice <= 0) {
      setPriceError('Informe um valor válido');
      valid = false;
    } else {
      setPriceError('');
    }
    return valid;
  };

  const handleSave = () => {
    if (!validate()) return;
    const unitPrice = Math.round(parseFloat(price.replace(',', '.')) * 100);
    onSave({
      id: initialService?.id ?? Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      unitPrice,
      quantity,
    });
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.kavContainer}
          >
            <View style={styles.sheet}>
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Serviço</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={22} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Name */}
                <AppInput
                  placeholder="Nome do serviço"
                  value={title}
                  onChangeText={setTitle}
                  error={titleError}
                  returnKeyType="next"
                />

                {/* Description */}
                <AppInput
                  placeholder="Descrição (opcional)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  style={{ minHeight: 72, textAlignVertical: 'top' }}
                  returnKeyType="next"
                />

                {/* Price + Quantity row */}
                <View style={styles.row}>
                  <AppInput
                    prefix="R$"
                    placeholder="0,00"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    error={priceError}
                    containerStyle={styles.priceInput}
                  />

                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      onPress={() => setQuantity(q => Math.max(1, q - 1))}
                      style={styles.qtyBtn}
                    >
                      <Feather name="minus" size={16} color={Colors.textPrimary} />
                    </TouchableOpacity>

                    <Text style={styles.qtyValue}>{quantity}</Text>

                    <TouchableOpacity
                      onPress={() => setQuantity(q => q + 1)}
                      style={styles.qtyBtn}
                    >
                      <Feather name="plus" size={16} color={Colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              {/* Footer actions */}
              <View style={styles.footer}>
                <TouchableOpacity onPress={onClose} style={styles.deleteBtn}>
                  <Feather name="trash-2" size={20} color={Colors.dangerBase} />
                </TouchableOpacity>

                <AppButton
                  label="Salvar"
                  onPress={handleSave}
                  icon={<Feather name="check" size={16} color={Colors.white} />}
                  style={styles.saveBtn}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  kavContainer: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  priceInput: {
    flex: 1,
    marginBottom: 0,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    overflow: 'hidden',
    height: 48,
    alignSelf: 'flex-start',
  },
  qtyBtn: {
    paddingHorizontal: Spacing.md,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
  },
  deleteBtn: {
    padding: Spacing.sm,
  },
  saveBtn: {
    flex: 1,
    marginLeft: Spacing.xl,
  },
});
