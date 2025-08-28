import { useState, useEffect } from "react";
import { Alert } from "react-native";

const useFetchUser = () => {
  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [correo, setCorreo] = useState("");
  
  // Estados para edición
  const [editandoId, setEditandoId] = useState(null);

  // Estados para la lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener usuarios desde la API
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://retoolapi.dev/zZhXYF/movil");
      const data = await response.json();
      setUsuarios(data);
      console.log("Usuarios cargados:", data); // Debug
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Guardar nuevo usuario en la API
  const handleGuardar = async () => {
    if (!nombre || !edad || !correo) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await fetch("https://retoolapi.dev/zZhXYF/movil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          edad: parseInt(edad),
          correo,
        }),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Usuario guardado correctamente");
        setNombre("");
        setEdad("");
        setCorreo("");
        fetchUsuarios(); // Actualizar lista
      } else {
        Alert.alert("Error", "No se pudo guardar el usuario");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un error al enviar los datos");
    }
  };

  // Función para eliminar usuario - CORREGIDA
  const handleEliminar = async (id) => {
    console.log("Eliminando usuario con ID:", id); // Debug
    
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este usuario?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `https://retoolapi.dev/zZhXYF/movil/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              console.log("Response status:", response.status); // Debug

              if (response.ok) {
                Alert.alert("Éxito", "Usuario eliminado correctamente");
                fetchUsuarios(); // Actualizar lista
              } else {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                Alert.alert("Error", "No se pudo eliminar el usuario");
              }
            } catch (error) {
              console.error("Error al eliminar:", error);
              Alert.alert("Error", "Ocurrió un error al eliminar el usuario");
            }
          },
        },
      ]
    );
  };

  // Función para iniciar la edición de un usuario
  const handleIniciarEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setNombre(usuario.nombre || usuario.name || "");
    setEdad((usuario.edad || usuario.age || "").toString());
    setCorreo(usuario.correo || usuario.email || "");
  };

  // Función para actualizar usuario existente - CORREGIDA
  const handleActualizar = async (datosActualizados = null) => {
    // Si se pasan datos directamente, usarlos; si no, usar los estados del formulario
    const datos = datosActualizados || {
      nombre,
      edad: parseInt(edad),
      correo,
    };

    if (!datos.nombre || !datos.edad || !datos.correo) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await fetch(
        `https://retoolapi.dev/zZhXYF/movil/${editandoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      console.log("Update response status:", response.status); // Debug

      if (response.ok) {
        Alert.alert("Éxito", "Usuario actualizado correctamente");
        setNombre("");
        setEdad("");
        setCorreo("");
        setEditandoId(null);
        fetchUsuarios(); // Actualizar lista
        return true; // Indicar éxito
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        Alert.alert("Error", "No se pudo actualizar el usuario");
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert("Error", "Ocurrió un error al actualizar los datos");
      return false;
    }
  };

  // Nueva función para actualizar con datos específicos (para el modal)
  const actualizarUsuario = async (id, datosUsuario) => {
    try {
      const response = await fetch(
        `https://retoolapi.dev/zZhXYF/movil/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: datosUsuario.name,
            edad: datosUsuario.age || 0,
            correo: datosUsuario.email,
          }),
        }
      );

      console.log("Update response status:", response.status); // Debug

      if (response.ok) {
        fetchUsuarios(); // Actualizar lista
        return true;
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      return false;
    }
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setEdad("");
    setCorreo("");
  };

  // Ejecutar al cargar componente
  useEffect(() => {
    fetchUsuarios();
    console.log("actualizando en useEffect");
  }, []);

  return {
    nombre,
    setNombre,
    edad,
    setEdad,
    correo,
    setCorreo,
    handleGuardar,
    handleActualizar,
    handleEliminar,
    handleIniciarEdicion,
    handleCancelarEdicion,
    actualizarUsuario, // Nueva función exportada
    usuarios,
    loading,
    fetchUsuarios,
    editandoId,
  };
};

export default useFetchUser;