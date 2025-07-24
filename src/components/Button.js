import { StyleSheet, TouchableOpacity, Text } from 'react-native';
 
const Buttons = ({texto, action}) => {
  return(
    <TouchableOpacity onPress={action}> style={styles.boton}
        
      <Text style={styles.texto}>
        {texto}
      </Text >
    </TouchableOpacity>
   );
}
 
 
const styles = StyleSheet.create({
    boton:{
        padding: 10,
        backgroundColor: "#fb6c4d",
        borderRadius: 15
    },
    texto:{
        fontSize: 15,
        textAlign: "center",
        fontWeight: "bold",
        color: "#FFFFFF"
    }
})
 
export default Buttons;