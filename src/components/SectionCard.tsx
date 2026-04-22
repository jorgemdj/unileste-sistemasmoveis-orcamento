// src/components/SectionCard.tsx

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii, Shadow } from '../theme';

interface Props {
  title?: string;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SectionCard: React.FC<Props> = ({ title, iconName, children, style }) => {
  return (
    <View style={[styles.card, Shadow.card, style]}>
      {title ? (
        <View style={styles.header}>
          {iconName ? (
            <Feather name={iconName} size={14} color={Colors.textSecondary} style={styles.icon} />
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  title: {
    ...Typography.titleXs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
