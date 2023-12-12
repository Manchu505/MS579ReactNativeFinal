import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, Linking, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Contacts from 'expo-contacts';
//import Contacts from 'react-native-contacts';


export default function Camera() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.back);
  const [X, setX] = useState(0); // Initialize with 0
  const [Y, setY] = useState(0); // Initialize with 0
  const [width, setWidth] = useState(0); // Initialize with 0
  const [height, setHeight] = useState(0); // Initialize with 0

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ bounds, data }) => {
    console.log(data)
    setScanned(true);
    const { origin, size } = bounds;
    setX(origin.x);
    setY(origin.y);
    setHeight(size.height);
    setWidth(size.width);
    setQrData(data);

    if (data.startsWith('http')) {
      // If URL is detected, open it in the browser
      await Linking.openURL(data);
      // If vCard is detected, save information to Contacts
    } else if (data.startsWith('BEGIN:VCARD')) {
      const vCardData = data.split('\n');
      let contact = [];
    
      for (let i = 1; i < vCardData.length - 1; i++) {
        const [field, value] = vCardData[i].split(':');
        
        const fieldName = field.split(';')[0];
  
        switch (fieldName) {
          case 'FN': // Full name
            contact.fullName = value;
            break;
          case 'N': // Name (separate first name and last name)
            const [lastName, firstName] = value.split(';');
            contact.firstName = firstName;
            contact.lastName = lastName;
            break;
            
            case 'ORG': // Organization or company
            contact.company = value;
            break;
          case 'TEL': // Phone number
            contact.PhoneNumbers = value;  
                      break;
          case 'EMAIL': // Email address
            contact.email = value;
            break;
            case 'ADR': // Address
            const [street, city, state, zip] = value.split(';');  
            contact.street = street;
            contact.city = city;
            contact.state = state;
            contact.postalCode = zip;
            break;
          
          // Add more vCard fields as needed
        }
      }
    
      try {
        const { status } = await Contacts.requestPermissionsAsync();
    
        if (status === 'granted') {
          await Contacts.addContactAsync(contact);
          Alert.alert('Contact Saved', 'The contact has been saved successfully.');
        } else {
          Alert.alert('Permission Denied', 'You need to grant contact permissions to save the contact.');
        }
      } catch (error) {
        console.error('Error saving contact:', error);
        Alert.alert('Error', 'An error occurred while saving the contact.');
      }
    }

  // Reset bounding box dimensions after successful scan
    setTimeout(() => {
      setX(0);
      setY(0);
      setHeight(0);
      setWidth(0);
      //setScanned(false); // This line resets the scanned state
    }, 2000); // adjust the delay (in milliseconds) as needed
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text> QR Scanner </Text>

        <BarCodeScanner
          type={type}
          BarCodeScannerSetting={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
          }}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={{ position: "absolute", top: Y, left: X, width: width, height: height, borderColor: 'red', borderWidth: 2 }}></View>
        </BarCodeScanner>
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        {qrData && <Text>QR Data: {qrData}</Text>}
      </View>
    </SafeAreaView>
  );
        }
    
   
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});