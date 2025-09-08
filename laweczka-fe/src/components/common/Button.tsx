import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles } from '../../styles/components';

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
  const buttonStyle: ViewStyle[] = [componentStyles.button];
  let textStyle: TextStyle = componentStyles.buttonText;
  let iconColor = '#ffffff';

  if (disabled || loading) {
    buttonStyle.push(componentStyles.buttonDisabled);
  } else {
    switch (variant) {
      case 'primary':
        buttonStyle.push(componentStyles.buttonPrimary);
        break;
      case 'danger':
        buttonStyle.push(componentStyles.buttonDanger);
        break;
      case 'outline':
        buttonStyle.push(componentStyles.buttonOutline);
        textStyle = componentStyles.buttonTextOutline;
        iconColor = '#22c55e';
        break;
      default:
        buttonStyle.push(componentStyles.buttonPrimary);
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
              style={componentStyles.buttonIcon} 
            />
          )}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
