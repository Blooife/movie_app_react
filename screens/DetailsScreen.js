import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { auth, db } from '../firebase';
import { getFirestore, collection, getDocs, query, where, getDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

import { Ionicons } from '@expo/vector-icons';

const DetailsScreen = ({ route }) => {
  //const { movie } = route.params;
  const [movie, setMovie] = useState(route.params.movie);
  const navigation = useNavigation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % movie.picture.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + movie.picture.length) % movie.picture.length);
  };

  const navigateToReviews = (movieId) => {
    navigation.navigate('Review', { movieId });
  };

  const handleRateClick = () => {
    setModalVisible(true);
  }
  
  const selectRating = (rating) => {
    setSelectedRating(rating);
    setModalVisible(false);
    // Здесь можно добавить логику для сохранения выбранной оценки в базу данных
  };

  useEffect(() => {
    let totalRating = 0;
    let ratingCount = 0;
    let currentUserRating = null;
    console.log(movie.rates);
    if(movie.rates){
      movie.rates.forEach((rate) => {
        totalRating += rate.rate;
        ratingCount++;
        if (rate.userId === auth.currentUser?.uid) {
          currentUserRating = rate.rate;
        }
      });
      setAverageRating(totalRating / ratingCount);
      setUserRating(currentUserRating);
    }
    

    
  }, [movie, selectedRating]);

  const updateMovieRating = async (rating) => {
    let userRatingIndex = -1;
    if(movie.rates){
      userRatingIndex = movie.rates.findIndex(rate => rate.userId === auth.currentUser?.uid);
    }  
    
    if (userRatingIndex !== -1) {
      // Обновить существующую оценку
      const updatedRates = [...movie.rates];
      updatedRates[userRatingIndex].rate = rating;
      
      const movieRef = doc(db, 'movies', movie.id);
      await updateDoc(movieRef, { rates: updatedRates });
     // db.collection('movies').doc(movie.id).update({ rates: updatedRates });
    } else {
      // Добавить новую оценку
      const newRate = { userId: auth.currentUser?.uid, rate: rating };
      const movieRef = doc(db, 'movies', movie.id);
      await updateDoc(movieRef, { rates: arrayUnion({ userId: auth.currentUser?.uid, rate: rating }) });

      const updatedMovieSnapshot = await getDoc(movieRef);
      const updatedMovie = {...updatedMovieSnapshot.data(), id: movie.id};
      setMovie(updatedMovie);
    }
    setSelectedRating(rating);
    setModalVisible(false); // Закрыть модальное окно после обновления
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
      <View style={styles.sliderContainer}>
          <TouchableOpacity onPress={handlePrevImage} style={styles.arrowLeft}>
            {/* Ваша иконка для листания влево */}
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image source={{ uri: movie.picture[currentImageIndex] }} style={styles.sliderImage} />
          </ScrollView>
          <TouchableOpacity onPress={handleNextImage} style={styles.arrowRight}>
            {/* Ваша иконка для листания вправо */}
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.ratingText}>
            Average Rating: {averageRating.toFixed(1)} ({movie.rates ? movie.rates.length : '0'} ratings)
          </Text>
        <View style={styles.rateContainer}>
          <TouchableOpacity onPress={() => handleRateClick()}>
            <Ionicons name="star" size={24} color="black" />
          </TouchableOpacity>
          {userRating && (
            <Text style={styles.userRatingText}>Your rate: {userRating}</Text>
          )}
         </View>
        <View style={styles.infoContainer}>
          {/* Movie details */}
          <Text style={styles.movieName}>{movie.name}</Text>
          <Text style={styles.movieYear}>{movie.year}</Text>
          <Text style={styles.movieGenre}>{movie.genre}</Text>
          <Text style={styles.movieCountry}>{movie.country}</Text>
          <Text style={styles.movieDescription}>{movie.description}</Text>
          
        </View>
        <TouchableOpacity style={styles.button} onPress={()=> navigateToReviews(movie.id)}>
          <Text style={styles.buttonText}>Reviews</Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} animationType="slide" transparent={true} statusBarTranslucent={true}>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Контент модального окна */}
            <View style={styles.modalRow}>
            {[1, 2, 3, 4, 5].map((number) => (
              <TouchableOpacity style={styles.modalButton} key={number} onPress={() =>  updateMovieRating(number)}>
                <Text style={styles.modalRating}>{number}</Text>
              </TouchableOpacity>
            ))}
            </View>
            <View style={styles.modalRow}>
            {[6, 7, 8, 9, 10].map((number) => (
              <TouchableOpacity style={styles.modalButton} key={number} onPress={() => updateMovieRating(number)}>
                <Text style={styles.modalRating}>{number}</Text>
              </TouchableOpacity>
            ))}
            </View>
    </View>
  </View>
        </Modal>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#eee',
    //marginTop: 10,
  },
  content: {
    width: '80%', 
    
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 400, 
    //top: 10,
    
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //top: 10,
    
  },
  sliderImage: {
    marginTop: 10,
    width: 320,
    height: 400,
  },
  arrowLeft: {
    position: 'absolute',
    left: 10,
    top: '45%',
    zIndex: 1, 
  },
  arrowRight: {
    position: 'absolute',
    right: 10,
    top: '45%',
    zIndex: 1, 
  },
  arrowText: {
    fontSize: 40, 
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  movieName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  movieYear: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  movieGenre: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  movieCountry: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  movieDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom:10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ratingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  userRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%', // Ширина модального окна
  },
  modalRating: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalRow: {
    
    flexDirection: 'row',
  },
  modalButton: {
    padding:5,
    margin:10,
    height:40,
    width:35,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#0782F9',
  },
});

export default DetailsScreen;
