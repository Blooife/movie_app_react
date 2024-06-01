import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, TextInput, FlatList } from 'react-native';
import { getFirestore, collection, getDocs, query, where, getDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Ionicons } from '@expo/vector-icons'; 

const HomeScreen = () => {
  const navigation = useNavigation();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchText, setSearchText] = useState('');

  const route = useRoute();
  const routeParams = route.params || {}; // Проверяем наличие route.params, если нет, то используем пустой объект

  const selectedCountry = routeParams.selectedCountry || '';
  const selectedGenre = routeParams.selectedGenre || '';
  const selectedArrow = routeParams.selectedArrow || '';


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
    
     let filteredData = [...newData]; 
     if (selectedCountry !== '') {
      filteredData = filteredData.filter(movie => {
        const countries = movie.country.split('/'); 
        return countries.includes(selectedCountry); 
      });
    }

    // Фильтрация по жанру
    if (selectedGenre !== '') {
      filteredData = filteredData.filter(movie => {
        const genres = movie.genre.split('/');
        return genres.includes(selectedGenre); 
      });
    }

    // Сортировка по стрелке (если нужно)
    if (selectedArrow === 'up') {
      filteredData.sort((a, b) => a.year - b.year);
    } else if (selectedArrow === 'down') {
      filteredData.sort((a, b) => b.year - a.year);
    }


    setMovies(filteredData);
    setFilteredMovies(filteredData);
    
    }      
  };
  
  const applyFilters = () => {
    let filteredData = [...movies]; 

    // Фильтрация по стране
    if (selectedCountry !== '') {
      filteredData = filteredData.filter(movie => {
        const countries = movie.country.split('/'); 
        return countries.includes(selectedCountry); 
      });
    }

    // Фильтрация по жанру
    if (selectedGenre !== '') {
      filteredData = filteredData.filter(movie => {
        const genres = movie.genre.split('/');
        return genres.includes(selectedGenre); 
      });
    }

    // Сортировка по стрелке (если нужно)
    if (selectedArrow === 'up') {
      filteredData.sort((a, b) => a.year - b.year);
    } else if (selectedArrow === 'down') {
      filteredData.sort((a, b) => b.year - a.year);
    }

    setMovies(filteredData);
    setFilteredMovies(filteredData); // Обновляем отфильтрованный список фильмов
  };

  useEffect( () => {
    fetchMovies();
  }, [selectedCountry, selectedGenre, selectedArrow]); // Зависимости useEffect
  

  const updateMovieStatus = (movieId, isLiked) => {
    setFilteredMovies((prevMovies) =>
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

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredMovies = text.trim() === '' // Проверяем, если текст пустой или состоит только из пробелов
      ? movies // Если да, то показываем все фильмы
      : movies.filter(
          (movie) =>
            movie.name.toLowerCase().includes(text.toLowerCase()) // Иначе фильтруем по названию фильма
        );
    setFilteredMovies(filteredMovies);
  };
  
  

  return (    
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Search by movie name"
      />
      <ScrollView style={styles.scrollView}>
      <View style={styles.moviesContainer}>
          {filteredMovies.map((movie, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.movieBox,
                index === filteredMovies.length - 1 && filteredMovies.length % 2 !== 0
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

export default HomeScreen;

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
  searchInput: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  lastMovieBox: {
    width: '45%', 
    marginRight: '48%',
  },
});
