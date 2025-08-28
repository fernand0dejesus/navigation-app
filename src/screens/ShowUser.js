import React, { useCallback, useState } from "react";
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

  // Se ejecuta cada vez que esta pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      fetchUsuarios();
    }, [])
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>
      <Text style={styles.subtitle}>
        Consulta los usuarios registrados desde la API
      </Text>

      {!loading && (
        <Text style={styles.counterText}>
          Total de usuarios: {usuarios.length}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#5C3D2E"
          style={{ marginTop: 20 }}
        />
      ) : (
        <>
          <FlatList
            data={usuarios}
            keyExtractor={(user) => user.id.toString()}
            renderItem={({ item }) => (
              <CardUser 
                user={item} 
                onEdit={() => handleEditUser(item)}
                onDelete={() => handleDeleteUser(item.id, item.nombre || item.name)}
                // Funciones de prueba para verificar que los props llegan correctamente
                // onEdit={() => testFunction('edit', item)}
                // onDelete={() => testFunction('delete', item)}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
          
          {deleting && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#5C3D2E" />
              <Text style={styles.loadingText}>Eliminando usuario...</Text>
            </View>
          )}
        </>
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
  loadingText: {
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