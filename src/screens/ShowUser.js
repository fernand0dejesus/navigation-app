import React, { useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";

//componente de la card
import CardUser from "../components/Users/CardUser";

import useFetchUser from "../hooks/useFetchUser";
import { useFocusEffect } from "@react-navigation/native";

const ShowUser = () => {
  // Usar las funciones del hook personalizado
  const { usuarios, loading, fetchUsuarios, handleEliminar, actualizarUsuario } = useFetchUser();
  
  // Estados para el modal de edición
  const [modalVisible, setModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: ''
  });
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // DEBUGGING: Agregar logs para verificar el estado
  console.log('=== DEBUG ShowUser Component ===');
  console.log('usuarios:', usuarios);
  console.log('usuarios.length:', usuarios?.length);
  console.log('loading:', loading);
  console.log('typeof usuarios:', typeof usuarios);
  console.log('Array.isArray(usuarios):', Array.isArray(usuarios));
  
  // Verificar el primer usuario si existe
  if (usuarios && usuarios.length > 0) {
    console.log('Primer usuario:', usuarios[0]);
    console.log('Estructura del primer usuario:', Object.keys(usuarios[0]));
  }

  // Se ejecuta cada vez que esta pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 useFocusEffect ejecutándose - llamando fetchUsuarios');
      fetchUsuarios();
    }, [])
  );

  // Efecto adicional para debug cuando cambien los usuarios
  useEffect(() => {
    console.log('👥 Usuarios actualizados:', usuarios.length, 'usuarios');
  }, [usuarios]);

  // Función para eliminar usuario - SIMPLIFICADA
  const handleDeleteUser = (userId, userName) => {
    console.log('Intentando eliminar usuario:', userId, userName); // Debug
    setDeleting(true);
    
    // Usar la función del hook
    handleEliminar(userId).finally(() => {
      setDeleting(false);
    });
  };

  // Función para abrir modal de edición
  const handleEditUser = (user) => {
    console.log('Editando usuario:', user); // Debug
    setUserToEdit(user);
    setEditForm({
      name: user.nombre || user.name || '',
      email: user.correo || user.email || '',
      phone: user.telefono || user.phone || '',
      age: (user.edad || user.age || '').toString()
    });
    setModalVisible(true);
  };

  // Función para actualizar usuario - CORREGIDA
  const updateUser = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      Alert.alert("Error", "Nombre y email son campos obligatorios");
      return;
    }

    console.log('Actualizando usuario:', userToEdit.id, editForm); // Debug
    setUpdating(true);
    
    try {
      const success = await actualizarUsuario(userToEdit.id, editForm);
      
      if (success) {
        Alert.alert(
          "Éxito", 
          "Usuario actualizado correctamente",
          [
            {
              text: "OK",
              onPress: () => {
                setModalVisible(false);
                setUserToEdit(null);
                setEditForm({ name: '', email: '', phone: '', age: '' });
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", "No se pudo actualizar el usuario");
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Alert.alert("Error", `Error de conexión: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Cerrar modal
  const closeModal = () => {
    setModalVisible(false);
    setUserToEdit(null);
    setEditForm({ name: '', email: '', phone: '', age: '' });
  };

  // Función de prueba para verificar que los botones funcionan
  const testFunction = (action, user) => {
    console.log('Botón presionado:', action, user);
    Alert.alert("Prueba", `Acción: ${action} para usuario: ${user.nombre || user.name}`);
  };

  // Función para renderizar cada item (con más debug)
  const renderUserItem = ({ item, index }) => {
    console.log(`Renderizando usuario ${index}:`, item);
    
    return (
      <CardUser 
        user={item} 
        onEdit={() => handleEditUser(item)}
        onDelete={() => handleDeleteUser(item.id, item.nombre || item.name)}
      />
    );
  };

  // Función de renderizado condicional mejorada
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5C3D2E" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      );
    }

    // Si no hay usuarios
    if (!usuarios || usuarios.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay usuarios registrados</Text>
          <Text style={styles.emptySubtitle}>
            {usuarios === null ? 'Error al cargar datos' : 'La lista está vacía'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              console.log('🔄 Botón retry presionado');
              fetchUsuarios();
            }}
          >
            <Text style={styles.retryButtonText}>Recargar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Si hay usuarios, mostrar la lista
    return (
      <FlatList
        data={usuarios}
        keyExtractor={(user, index) => {
          const key = user.id ? user.id.toString() : `user-${index}`;
          console.log(`Key para usuario ${index}:`, key);
          return key;
        }}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContainer}
        onRefresh={() => {
          console.log('🔄 Pull to refresh ejecutado');
          fetchUsuarios();
        }}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Lista vacía</Text>
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>
      <Text style={styles.subtitle}>
        Consulta los usuarios registrados desde la API
      </Text>

      {/* Información de debug */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Estado: {loading ? 'Cargando...' : 'Cargado'}
        </Text>
        <Text style={styles.debugText}>
          Usuarios encontrados: {usuarios ? usuarios.length : 'null'}
        </Text>
        <Text style={styles.debugText}>
          Tipo de datos: {Array.isArray(usuarios) ? 'Array' : typeof usuarios}
        </Text>
      </View>

      {!loading && usuarios && usuarios.length > 0 && (
        <Text style={styles.counterText}>
          Total de usuarios: {usuarios.length}
        </Text>
      )}

      {renderContent()}
      
      {deleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5C3D2E" />
          <Text style={styles.overlayText}>Eliminando usuario...</Text>
        </View>
      )}

      {/* Modal para editar usuario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Usuario</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editForm.name}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editForm.email}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={editForm.age}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, age: text }))}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Teléfono (opcional)"
              value={editForm.phone}
              onChangeText={(text) => setEditForm(prev => ({ ...prev, phone: text }))}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={closeModal}
                disabled={updating}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton, updating && styles.disabledButton]} 
                onPress={updateUser}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAD8C0",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  listContainer: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5C3D2E",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#5C3D2E",
    textAlign: "center",
    marginBottom: 10,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B2C24",
    textAlign: "center",
    marginBottom: 10,
  },
  // Estilos de debug
  debugContainer: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  debugText: {
    fontSize: 12,
    color: '#6C7B7F',
    marginBottom: 2,
  },
  // Loading container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: '#5C3D2E',
    fontSize: 16,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C3D2E',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#5C3D2E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Overlay de carga para eliminación
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    marginTop: 10,
    color: '#5C3D2E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C3D2E',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#CCC',
  },
  saveButton: {
    backgroundColor: '#5C3D2E',
  },
  disabledButton: {
    backgroundColor: '#AAA',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShowUser;