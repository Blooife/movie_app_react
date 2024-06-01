/*import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import {collection, getDocs, addDoc} from 'firebase/firestore'
import {auth, db } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import UserData from '../data/UserData'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          const userData = new UserData();
          userData.uid = user.uid;
          userData.email = user.email;
          userData.name = 'hahaha';
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

  const handleLogin = async() => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        
      })
      .catch(error => alert(error.message))                 

  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
};

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})*/
/*import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import SignInComponent from '../components/SignInComponent';
import SignUpComponent from '../components/SignUpComponent';
import { LinearGradient } from 'expo-linear-gradient';


const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('SignIn');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <LinearGradient
        colors={['#2296F3', '#03DAC6', '#f2f2f2']}
        style={styles.background}
      >
        <View style={styles.slider}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'SignIn' && styles.activeTab]}
            onPress={() => handleTabChange('SignIn')}
          >
            <Text style={styles.tabText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'SignUp' && styles.activeTab]}
            onPress={() => handleTabChange('SignUp')}
          >
            <Text style={styles.tabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'SignIn' ? <SignInComponent /> : <SignUpComponent />}
      </LinearGradient>
      {/* Render login or registration components based on activeTab */
      /*}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Выравнивание по нижнему краю
    alignItems: 'center',
    paddingBottom: 400, // Подстройте отступ снизу по вашему желанию
  },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end', // Градиент должен начинаться снизу
    //paddingBottom: 600, // Высота градиента между двумя первыми цветами
    alignItems: 'center', 
  },
  slider: {
    paddingTop: 200,
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    position: 'relative',
    bottom: -2,
  },
  
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: 'black',
  },
  tabIndicator: {
    marginTop: 2,
    height: 2,
    backgroundColor: 'black',
    width: '50%',
  },
});


export default LoginScreen;*/

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import SignInComponent from '../components/SignInComponent';
import SignUpComponent from '../components/SignUpComponent';
import { LinearGradient } from 'expo-linear-gradient';


const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('SignIn');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <LinearGradient
        colors={['#2296F3', '#03DAC6', '#f2f2f2']}
        style={styles.background}
      >
        <View style={styles.spacer}></View>
        <View style={styles.slider}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'SignIn' && styles.activeTab]}
            onPress={() => handleTabChange('SignIn')}
          >
            <Text style={styles.tabText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'SignUp' && styles.activeTab]}
            onPress={() => handleTabChange('SignUp')}
          >
            <Text style={styles.tabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'SignIn' ? <SignInComponent /> : <SignUpComponent />}
      </LinearGradient>
      
      {/* Render login or registration components based on activeTab */}
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  background: {
    height:300,
    width: '100%',
    alignItems: 'center', 
  },
  spacer: {
    height:200,
  },
  slider: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  tab: {
   
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    position: 'relative',
  },
  
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: 'black',
  },
  tabIndicator: {
    top:0,
    marginTop: 2,
    height: 2,
    backgroundColor: 'black',
    width: '50%',
  },
});


export default LoginScreen;

