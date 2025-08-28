import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Buttons = ({ 
  texto, 
  action, 
  variant = 'primary', 
  disabled = false, 
  loading = false, 
  style,
  textStyle 
}) => {
  
  const getButtonStyle = () => {
    const baseStyle = [styles.boton];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
      case 'edit':
        baseStyle.push(styles.editButton);
        break;
      case 'cancel':
        baseStyle.push(styles.cancelButton);
        break;
      default:
        baseStyle.push(styles.primaryButton);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.texto];
    
    if (variant === 'secondary' || variant === 'cancel') {
      baseStyle.push(styles.secondaryText);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity 
      onPress={disabled || loading ? null : action} 
      style={getButtonStyle()}
      activeOpacity={disabled || loading ? 1 : 0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'secondary' || variant === 'cancel' ? "#5C3D2E" : "#FFFFFF"} 
        />
      ) : (
        <Text style={getTextStyle()}>
          {texto}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Mejor accesibilidad táctil
  },
  primaryButton: {
    backgroundColor: "#5C3D2E", // Color consistente con la pantalla ShowUser
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#5C3D2E",
  },
  dangerButton: {
    backgroundColor: "#DC3545", // Rojo para acciones peligrosas como eliminar
  },
  editButton: {
    backgroundColor: "#007BFF", // Azul para editar
  },
  cancelButton: {
    backgroundColor: "#CCC",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    borderColor: "#CCCCCC",
  },
  texto: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#5C3D2E",
  },
  disabledText: {
    color: "#888888",
  },
});

export default Buttons;