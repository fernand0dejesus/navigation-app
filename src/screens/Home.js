import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import Buttons from "../components/Button";
 
export default function Home({ navigation }) {
  const irShowUsers = () => {
    navigation.navigate("ShowUser");
  };
 
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/perfil.png")} style={styles.image} />
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>
        Esta aplicación nos servirá para comprender como utilizar la navegación
        y un tab menu en una aplicación móvil de react native
      </Text>
 
      <Buttons texto="ver todos usuarios" action={irShowUsers} /> 
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    width: "80%", // Responsive en móviles
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#2E4374",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#3B2F2F",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    color: "#7D5A50",
  },
  
});
