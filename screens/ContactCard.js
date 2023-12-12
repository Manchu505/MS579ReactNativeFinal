import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const QRCodeGenerator = () => {
  const navigation = useNavigation();
  const [vCardData, setVCardData] = useState('');
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [lname, setLName] = useState('');
  const [fname, setFName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    function validateForm() {
    let errors = {};
    if (!fname) {
      errors.fname = 'First Name is required.';
    }
    if (!lname) {
      errors.lname = 'Last Name is required.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid.';
    }

    setErrors(errors);
  }
  validateForm()

  }, [fname, lname, email]);

  const generateVCardQRCode = () => {
    if (Object.keys(errors).length > 0) {
      // Handle the case when there are validation errors, e.g., display a message or prevent QR code generation.
      return;
    }
    const vCardAdmin = `BEGIN:VCARD
VERSION:4.0
FN:${fname} ${lname}
N:${lname};${fname}
ORG:${organization}
TEL;TYPE=mobile:${tel}
EMAIL;TYPE=work:${email}
ADR;TYPE=wor:${street};${city};${state};${zip}
END:VCARD`;

    setVCardData(vCardAdmin);
    setShowGenerateButton(false);
    navigation.navigate('QRCard', { paramKey: vCardData });
  };

  const clearScreen = () => {
    setVCardData('');
    setShowGenerateButton(true);
  };
// add save function to the contact card
const saveData = async () => {
  // Validation
  let errors = {};
  let isValid = true;

  if (!lname) {
    errors.lname = 'Last name is required.';
    isValid = false;
  }

  if (!fname) {
    errors.fname = 'First name is required.';
    isValid = false;
  }

  // Add similar checks for other fields...

  if (!email) {
    errors.email = 'Email is required.';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Email is invalid.';
    isValid = false;
  }

  setErrors(errors);

  // Save data only if all validations pass
  if (isValid) {
    try {
      const formData = { lname, fname, organization, email, tel, street, city, state, zip };
      await AsyncStorage.setItem('formData', JSON.stringify(formData));
      alert('Data saved!');
    } catch (error) {
      console.log(error);
    }
  }
};
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('formData');
        if (savedData !== null) {
          const { lname, fname, organization, email, tel, street, city, state, zip } = JSON.parse(savedData);
          setLName(lname);
          setFName(fname);
          setOrganization(organization);
          setEmail(email);
          setTel(tel);
          setStreet(street);
          setCity(city);
          setState(state);
          setZip(zip);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };
  
    loadData();
  }, []);
  
  const clearAllData = async () => {
    try {
      // Clear form fields
      setLName('');
      setFName('');
      setOrganization('');
      setEmail('');
      setTel('');
      setStreet('');
      setCity('');
      setState('');
      setZip('');
      setErrors({});
  
      // Clear saved data in AsyncStorage
      await AsyncStorage.removeItem('formData');
      alert('All data cleared!');
    } catch (error) {
      // Error clearing data
      console.log(error);
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.errorText}>{errors.fname}</Text>
      <TextInput
        style={styles.input}
        value={fname}
        placeholder="Enter your first name:"
        onChangeText={(text) => setFName(text)}
      />
      <Text style={styles.errorText}>{errors.lname}</Text>
      <TextInput
        style={styles.input}
        value={lname}
        placeholder="Enter your last name:"
        onChangeText={(text) => setLName(text)}
      />

      <TextInput
        style={styles.input}
        value={organization}
        placeholder="Enter your organization:"
        onChangeText={(text) => setOrganization(text)}
      />
      <Text style={styles.errorText}>{errors.email}</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Enter your email:"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        value={tel}
        placeholder="Enter your work telephone:"
        onChangeText={(text) => setTel(text)}
      />
      <TextInput
        style={styles.input}
        value={street}
        placeholder="Enter your work street:"
        onChangeText={(text) => setStreet(text)}
      />
      <TextInput
        style={styles.input}
        value={city}
        placeholder="Enter your work city:"
        onChangeText={(text) => setCity(text)}
      />
      <TextInput
        style={styles.input}
        value={state}
        placeholder="Enter your work state:"
        onChangeText={(text) => setState(text)}
      />
      <TextInput
        style={styles.input}
        value={zip}
        placeholder="Enter your work zip:"
        onChangeText={(text) => setZip(text)}
      />
      {vCardData ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 5 }}>
          <TouchableOpacity style={styles.generateButton} onPress={() => navigation.navigate('QRCard', {screen: 'QRCard'})}>
        <Text style={styles.generateButtonText}>View QR Contact Card</Text>
      </TouchableOpacity>
          <TouchableOpacity onPress={clearScreen} style={styles.generateButton}>
            <Text style={styles.generateButtonText}>Clear QR Code</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {Object.keys(errors).length > 0 && (
            <Text style={styles.warningText}>Warning: Some fields are missing.</Text>
          )}
          <Text style={styles.infoText}>
            Generate a vCard QR Code to share contact information.
          </Text>
          {showGenerateButton && (
            <TouchableOpacity onPress={generateVCardQRCode} style={styles.generateButton}>
              <Text style={styles.generateButtonText}>Generate vCard QR Code</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={saveData} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAllData} style={styles.clearButton}>
            <Text style={styles.clearAllButtonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 20,
  },
  qrText: {
    marginTop: 10,
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  warningText: {
    color: 'orange',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    fontSize: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    //marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  clearAllButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  
});

export default QRCodeGenerator;
