import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { getFirestore, collection, getDocs, query, where, getDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Ionicons } from '@expo/vector-icons'; // Импортируйте иконку

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [movies, setMovies] = useState([]);

  const navigateToMovieDetails = (movie) => {
    navigation.navigate('Details', { movie });
  };

  const fetchMovies = async () => {
    const curUser = auth.currentUser?.email;
    const q = query(collection(db, 'users'), where('email', '==', curUser));
    const qSnapshot = await getDocs(q);
    if (!qSnapshot.empty) {
      const userData = qSnapshot.docs[0].data();
      const querySnapshot = await getDocs(collection(db, "movies"));
    const newData = querySnapshot.docs.map((doc) => ({ 
      ...doc.data(), 
      id: doc.id,
      isFav: userData.favorites?.includes(doc.id) || false,
     }));
    setMovies(newData);
    }  
  
  };
  

  useEffect(() => {
    fetchMovies();
  }, []);

  const updateMovieStatus = (movieId, isLiked) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isFav: isLiked } : movie
      )
    );
  };

  const handleLikePress = async (movieId) => {
    const curUser = auth.currentUser;
    if (!curUser) {
      console.error('User not logged in.');
      return;
    }
  
    const userRef = doc(db, 'users', curUser.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error('User document not found.');
      return;
    }
  
    const userData = userDoc.data();
    const favorites = userData.favorites || [];
    const isMovieLiked = favorites.includes(movieId);
  
    // If the movie is already liked, remove it from favorites; otherwise, add it.
    const updatedFavorites = isMovieLiked
      ? favorites.filter((id) => id !== movieId)
      : [...favorites, movieId];
  
      try {
        await updateDoc(userRef, { favorites: updatedFavorites });
        console.log(`Updated favorites for user ${curUser.uid}.`);
        updateMovieStatus(movieId, !isMovieLiked); // Обновление состояния фильма
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
  };
  
  const likedMovies = movies.filter((movie) => movie.isFav);

  return (    
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={styles.moviesContainer}>
          {likedMovies.map((movie, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.movieBox,
                index === likedMovies.length - 1 && likedMovies.length % 2 !== 0
                ? styles.lastMovieBox // Стили для последнего фильма в левой колонке
                : null,
            ]}
              onPress={() => navigateToMovieDetails(movie)}
            >
              <Image source={{ uri: movie.picture[0] }} style={styles.movieImage} />
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle}>{movie.name} ({movie.year})</Text>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => handleLikePress(movie.id)}
                >
                  <Ionicons
                    name={movie.isFav ? 'heart' : 'heart-outline'}
                    size={24}
                    color={movie.isFav ? 'red' : 'black'}
                  />
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  moviesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  movieBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: '45%',
    height: 300,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  movieImage: {
    width: '100%',
    height: 230,
    borderRadius: 10,
    marginBottom: 5,
  },
  movieInfo: {
    alignItems: 'flex-start', 
  },
  movieTitle: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute', 
    top: 20, 
    right: -5, 
  },
  lastMovieBox: {
    width: '45%', 
    marginRight: '48%',
  },
  
});
