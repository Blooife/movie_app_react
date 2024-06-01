import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native';

const UserScreen = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [favCountry, setFavCountry] = useState('');
  const [favGenre, setFavGenre] = useState('');
  const [gender, setGender] = useState(true); // true for Male, false for Female
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const curUser = auth.currentUser?.email;
      const q = query(collection(db, 'users'), where('email', '==', curUser));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserData(userData);
        setName(userData.name || '');
        setSurname(userData.surname || '');
        setEmail(userData.email || '');
        setPhoneNumber(userData.phoneNumber || '');
        setBirthDate(userData.birthDate.toDate() || new Date());
        setCountry(userData.country || '');
        setCity(userData.city || '');
        setAbout(userData.about || '');
        setGender(userData.gender);
        setFavCountry(userData.favCountry || '');
        setFavGenre(userData.favGenre || '');
      } else {
        console.log('User not found');
      }
    };
  
    fetchUser();
  }, []);
  

  const updateUser = async () => {
    const curUser = auth.currentUser;
    const userRef = doc(db, 'users', curUser.uid);
    const updatedUserData = {
      name,
      surname,
      email,
      phoneNumber,
      birthDate,
      country,
      city,
      about,
      gender,
      favCountry,
      favGenre,
    };

    try {
      await updateDoc(userRef, updatedUserData);
      console.log('User data updated successfully');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const deleteUser = async () => {
    
    let user = auth.currentUser;
    console.log(user.uid);
    console.log(user);

    const usersRef = collection(db, 'users');

    // Найти документ с определенным email
    const querySnapshot = await getDocs(query(usersRef, where('email', '==', user.email)));

    // Проверить, есть ли документы с таким email
    if (!querySnapshot.empty) {
      // Получить ссылку на документ
      const userDocRef = querySnapshot.docs[0].ref;

      // Удалить документ
      await deleteDoc(userDocRef);
    } else {
      console.log('Пользователь с таким email не найден.');
    }
    await user.delete();
    navigation.navigate('Login');
    
  }

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };
  

  return (
    <ScrollView style={styles.container}>
      {userData ? (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Surname"
            value={surname}
            onChangeText={(text) => setSurname(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            editable={false}
            style={styles.input}
          />
           <View style={styles.dateContainer}>
            <Text style={styles.label}>Birth Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text>{birthDate ? new Date(birthDate).toLocaleDateString() : ''}</Text>
              <Ionicons name="ios-calendar" size={24} color="black" /> 
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.label}>Gender:</Text>
            <View style={styles.radioButtons}>
              <TouchableOpacity onPress={() => setGender(true)}>
                <Text style={[styles.radioButton, gender === true && styles.radioButtonSelected]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setGender(false)}>
                <Text style={[styles.radioButton, gender === false && styles.radioButtonSelected]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>   
          <TextInput
            placeholder="Country"
            value={country}
            onChangeText={(text) => setCountry(text)}
            style={styles.input}
          />       
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={(text) => setCity(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="About me"
            value={about}
            multiline
            numberOfLines={5}
            onChangeText={(text) => setAbout(text)}
            style={styles.multilineInput}
          />          
          <Text style={styles.label}>Preferences</Text>
          <Text style={styles.labelFav}>Country:</Text>
          <View style={styles.pickerContainer}>
            
            <Picker
              selectedValue={favCountry}
              onValueChange={(itemValue) => setFavCountry(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select a country" value="" />
              <Picker.Item label="None" value="None" />
              <Picker.Item label="USA" value="USA" />
              <Picker.Item label="Canada" value="Canada" />
              <Picker.Item label="UK" value="UK" />
            </Picker>
          </View>
          <Text style={styles.labelFav}>Genre:</Text>
          <View style={styles.pickerContainer}>
            
            <Picker
              selectedValue={favGenre}
              onValueChange={(itemValue) => setFavGenre(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select a genre" value="" />
              <Picker.Item label="None" value="None" />
              <Picker.Item label="Action" value="Action" />
              <Picker.Item label="Comedy" value="Comedy" />
              <Picker.Item label="Drama" value="Drama" />
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={updateUser}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteUser}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>

        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  multilineInput: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    height: 150,
  },
  dateContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center', // Center the text
  },
  labelFav: {
    fontSize: 16,
    marginBottom: 5, // Center the text
  },
  radioButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the radio buttons horizontally
  },
  radioButton: {
    fontSize: 14,
    marginRight: 20,
    fontWeight: 'bold',
  },
  
  radioContainer: {
    marginBottom: 10,
  },
  radioButtonSelected: {
    color: '#2296F3',
  },
  pickerContainer: {
    marginBottom: 10,
    borderRadius: 10, // Add border radius
    borderWidth: 1,
    borderColor: 'black',
  },
  picker: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10, // Add border radius
    borderWidth: 0, // Remove border from the Picker itself
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButton: {
    width: 120,
    borderRadius: 30,
    backgroundColor: '#2296F3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginLeft: 50,
  },
  deleteButton: {
    width: 120,
    borderRadius: 30,
    backgroundColor: '#2296F3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

export default UserScreen;
