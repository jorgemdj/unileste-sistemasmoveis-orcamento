// src/components/AppInput.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Spacing, Radii } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<Props> = ({
  label,
  error,
  prefix,
  containerStyle,
  style,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? Colors.dangerBase
    : focused
    ? Colors.purpleBase
    : Colors.border;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          { borderColor },
          focused && styles.focused,
          error ? styles.errorBorder : null,
        ]}
      >
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textDisabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.titleXs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    minHeight: 48,
  },
  focused: {
    borderColor: Colors.purpleBase,
  },
  errorBorder: {
    borderColor: Colors.dangerBase,
  },
  prefix: {
    ...Typography.textSm,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    ...Typography.textSm,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  errorText: {
    ...Typography.textXs,
    color: Colors.dangerBase,
    marginTop: Spacing.xs,
  },
});
