import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CardUser = ({ user, onEdit, onDelete }) => {
  
  // Debug: Verificar qué datos llegan
  console.log('CardUser recibió:', {
    user: user,
    hasOnEdit: typeof onEdit === 'function',
    hasOnDelete: typeof onDelete === 'function'
  });

  return (
    <View style={styles.card}>
      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{user?.id || 'Sin ID'}</Text>
        
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{user?.name || 'Sin nombre'}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'Sin email'}</Text>
        
        {user?.phone && (
          <>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </>
        )}
      </View>
      
      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            console.log('Botón Editar presionado para usuario ID:', user?.id);
            if (onEdit) {
              onEdit();
            } else {
              console.log('onEdit no está definido');
            }
          }}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => {
            console.log('Botón Eliminar presionado para usuario ID:', user?.id);
            if (onDelete) {
              onDelete();
            } else {
              console.log('onDelete no está definido');
            }
          }}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#5C3D2E',
  },
  userInfo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5C3D2E',
    marginTop: 5,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  editButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardUser;