import React from 'react';
import { TextInput, View, Text, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerStyle,
  style,
  ...props
}) => {
  const inputStyle = [
    styles.input,
    error && styles.inputError,
    icon && styles.inputWithIcon,
    style
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color="#9e9e9e" />
          </View>
        )}
        <TextInput
          style={inputStyle}
          placeholderTextColor="#9e9e9e"
          {...props}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  iconContainer: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 10,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
});