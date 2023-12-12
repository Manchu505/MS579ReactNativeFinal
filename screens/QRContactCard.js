import React from "react"; 
import { Text, View } from "react-native"; 
import { Ionicons } from "@expo/vector-icons"; 

const QRContactCard = ({ route, navigation }) => {
	const { vCardData } = route.params;
  
	return (
	  <View style={styles.container}>
		{/* Display QR Code */}
		<QRCode value={vCardData} size={200} />
		{/* Add other UI elements as needed */}
	  </View>
	);
  }; 

export default QRContactCard; 

