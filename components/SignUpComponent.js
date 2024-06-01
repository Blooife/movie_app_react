import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {collection, getDocs, addDoc} from 'firebase/firestore'
import {auth, db } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import UserData from '../data/UserData'
import { useNavigation } from '@react-navigation/core'
import { Ionicons } from '@expo/vector-icons';

const SignUpComponent = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home")        
      }
    })
    return unsubscribe
  }, [])

  const handleSignUp = () => {  
      if(!name){
        console.log('name is empty');
        return;
      }  
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          const userData = new UserData();
          userData.uid = user.uid;
          userData.email = user.email;
          userData.name = name;
          const userRef = collection(db, "users");
          addDoc(userRef, { ...userData })
            .then((docRef) => {
              console.log("User data added with ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Error adding user data: ", error);
            });
            console.log('Registered with:', user.email);     
  })};

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword); // Toggle the state
  };

  return (
    <View
      style={styles.container}
    >
      {/* Email input with icon */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
        <TextInput  
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={hidePassword} // Toggle secureTextEntry based on state
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={hidePassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
   
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,   
  },
  icon: {
    //position: 'absolute',
    //marginRight:10,
    
  },
  input: {
    flex: 1,
    width: '30%',
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    position: 'absolute',
    
    right: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default SignUpComponent;
