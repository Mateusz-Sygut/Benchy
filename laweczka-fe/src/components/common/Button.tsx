import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  icon,
  disabled,
  style,
  ...props
}) => {
  const buttonStyle: ViewStyle[] = [styles.button];
  let textStyle: TextStyle = styles.buttonText;
  let iconColor = '#ffffff';

  if (disabled || loading) {
    buttonStyle.push(styles.disabled);
  } else {
    switch (variant) {
      case 'primary':
        buttonStyle.push(styles.primary);
        break;
      case 'danger':
        buttonStyle.push(styles.danger);
        break;
      case 'outline':
        buttonStyle.push(styles.outline);
        textStyle = styles.outlineText;
        iconColor = '#22c55e';
        break;
      default:
        buttonStyle.push(styles.primary);
    }
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={iconColor} 
              style={styles.icon} 
            />
          )}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: '#22c55e',
  },
  danger: {
    backgroundColor: '#d32f2f',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  disabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outlineText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
});