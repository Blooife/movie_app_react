  import React from 'react';
  import { useState } from 'react';
  import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import { useNavigation } from '@react-navigation/native';
  import { auth } from '../firebase';
  import { Picker } from '@react-native-picker/picker';

  const HomeHeader = () => {
    const navigation = useNavigation();
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedArrow, setSelectedArrow] = useState('');

    const handleSignOut = () => {
      auth
        .signOut()
        .then(() => {
          navigation.replace('Login');
        })
        .catch((error) => alert(error.message));
    };
    const handleFilterPress = () => {
      setIsFilterModalVisible(true);
    };
    const closeModal = () => {
      setSelectedCountry('');
      setSelectedGenre('');
      setSelectedArrow('');
      setIsFilterModalVisible(false);
      navigation.navigate('Home', {
      });
    };

    const handleApplyFilters = () => {    
      setIsFilterModalVisible(false);
      navigation.navigate('Home', {
        selectedCountry,
        selectedGenre,
        selectedArrow,
      });
    };

    return (
      <View style={styles.header}>
        <View style={styles.leftContainer}>
        <Ionicons name="film" size={24} color="black" style={styles.icon} />
          <Text style={styles.text}>MOVIES</Text>
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('User')}>
            <Ionicons name="person" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterPress()}>
            <Ionicons name="filter" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSignOut()}>
            <Ionicons name="log-out" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Modal visible={isFilterModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.radioButtonsContainer}>
            <TouchableOpacity
                style={[styles.radioButton, selectedArrow === 'up' && styles.selectedArrow]} // Apply style for selected arrow
                onPress={() => setSelectedArrow('up')}
              >
                <Ionicons name="arrow-up" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, selectedArrow === 'down' && styles.selectedArrow]} // Apply style for selected arrow
                onPress={() => setSelectedArrow('down')}
              >
                <Ionicons name="arrow-down" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={selectedCountry}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedCountry(itemValue)}
            >
              <Picker.Item label="Select Country" value="" />
              <Picker.Item label="None" value="None" />
              <Picker.Item label="USA" value="USA" />
              <Picker.Item label="Canada" value="Canada" />
              <Picker.Item label="UK" value="UK" />
            </Picker>
            <Picker
              selectedValue={selectedGenre}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedGenre(itemValue)}
            >
              <Picker.Item label="Select Genre" value="" />
              <Picker.Item label="None" value="None" />
              <Picker.Item label="Action" value="Action" />
              <Picker.Item label="Comedy" value="Comedy" />
              <Picker.Item label="Drama" value="Drama" />
            </Picker>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleApplyFilters} style={styles.applyButton}>
                <Text>Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      height: 65,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginTop:10,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 10,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      width: '100%',
      paddingHorizontal: 20,
      marginTop: '110%', // Adjust as needed
    },
    picker: {
      width: '100%',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    applyButton: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 15,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginRight: 10,
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 15,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    radioButtonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    radioButton: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 15,
      padding: 10,
      marginHorizontal: 10,
    },
    selectedArrow: {
      backgroundColor: '#2296F3', // Example background color for selected arrow
    },
  });

  export default HomeHeader;
