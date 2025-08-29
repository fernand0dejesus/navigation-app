import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Button = ({
  texto,
  action,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.base];

    if (styles[variant]) {
      baseStyle.push(styles[variant]);
    } else {
      baseStyle.push(styles.primary);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseText = [styles.baseText];

    if (variant === 'secondary' || variant === 'cancel') {
      baseText.push(styles.secondaryText);
    }

    if (disabled) {
      baseText.push(styles.disabledText);
    }

    if (textStyle) {
      baseText.push(textStyle);
    }

    return baseText;
  };

  return (
    <TouchableOpacity
      onPress={disabled || loading ? null : action}
      style={getButtonStyle()}
      activeOpacity={disabled || loading ? 1 : 0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'cancel' ? "#5C3D2E" : "#FFFFFF"}
        />
      ) : (
        <Text style={getTextStyle()}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  // Variants
  primary: {
    backgroundColor: "#2E4374", // azul oscuro elegante
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#5C3D2E",
  },
  danger: {
    backgroundColor: "#D9534F", // rojo suave
  },
  edit: {
    backgroundColor: "#0275D8", // azul vibrante
  },
  cancel: {
    backgroundColor: "#EEEEEE",
  },
  disabled: {
    backgroundColor: "#CCCCCC",
    borderColor: "#CCCCCC",
  },

  // Text
  baseText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#5C3D2E",
  },
  disabledText: {
    color: "#AAAAAA",
  },
});

export default Button;
