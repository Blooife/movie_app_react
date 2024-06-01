import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Инициализируем Firebase приложение
const firebaseConfig = {
    apiKey: "AIzaSyBW05-nGWvVIvryMgVus2eCDig5hp8ZzMQ",
    authDomain: "movie-app-d135a.firebaseapp.com",
    projectId: "movie-app-d135a",
    storageBucket: "movie-app-d135a.appspot.com",
    messagingSenderId: "1020627167980",
    appId: "1:1020627167980:android:11a279a5cd27e1072f53c9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Получить данные пользователя по UID
export async function getUserData(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Получить список фильмов
export async function getMovies() {
  try {
    const moviesRef = collection(db, 'movies');
    const snapshot = await getDocs(moviesRef);
    const moviesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return moviesList;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

// Получить список отзывов
export async function getReviews() {
  try {
    const reviewsRef = collection(db, 'reviews').orderBy('time', 'desc');
    const snapshot = await getDocs(reviewsRef);
    const reviewsList = snapshot.docs.map((doc) => doc.data());
    return reviewsList;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// Другие методы для обновления данных, добавления отзывов и т.д.
