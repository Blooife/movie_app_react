import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { query, collection, getDocs, where, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ReviewScreen = ({ route }) => {
  const { movieId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');

  const fetchReviews = async () => {
    const q = query(collection(db, 'reviews'), where('movieId', '==', movieId));
    const qSnapshot = await getDocs(q);

    if (!qSnapshot.empty) {
      const revData = qSnapshot.docs.map(doc => doc.data());
      revData.sort((a, b) => b.time - a.time);
      setReviews(revData);
    } else {
      setReviews([]);
    }
  };

  const handleReviewSubmit = async () => {
    if (newReview.trim() === '') {
      return; 
    }
    try {
      const curUser = auth.currentUser?.email;
      const q = query(collection(db, 'users'), where('email', '==', curUser));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {      
      const docRef = await addDoc(collection(db, 'reviews'), {
        movieId: movieId,
        userId: auth.currentUser.uid,
        text: newReview,
        time: new Date(),
        userName: querySnapshot.docs[0].data().name,
      });
      console.log('Review added with ID: ', docRef.id);
      setNewReview(''); 
      fetchReviews(); 
    }
    } catch (error) {
      console.error('Error adding review: ', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ScrollView>
      <View style={styles.reviewInputContainer}>
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review..."
          multiline
          value={newReview}
          onChangeText={setNewReview}
        />        
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewContainer}>
          <Text style={styles.userName}>{review.userName}</Text>
          <Text style={styles.timestamp}>{new Date(review.time.toDate()).toLocaleString()}</Text>
          <View style={styles.reviewTextContainer}>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  reviewInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  reviewInput: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 0,
  },
  submitButton: {
    width: 90,
    backgroundColor: '#0782F9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  submitButtonText: {
    
    color: '#fff',
    fontWeight: 'bold',
  },
  reviewContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    marginVertical: 10,
    elevation: 2, // Add elevation for shadow effect
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
  reviewTextContainer: {
    marginTop: 5,
  },
  reviewText: {
    fontSize: 14,
  },
});

export default ReviewScreen;
