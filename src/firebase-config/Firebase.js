import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBD42LGaSoMx3Z1ZgCCbjoqnXTqFXT-iDY",
  authDomain: "bubbly-369ad.firebaseapp.com",
  projectId: "bubbly-369ad",
  storageBucket: "bubbly-369ad.firebasestorage.app",
  messagingSenderId: "593511706553",
  appId: "1:593511706553:web:f8a656441d670a2ef95068"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


export const getReviews = async () => {
  try {
    const reviewsCollection = collection(db, 'reviews');
    const reviewsSnapshot = await getDocs(reviewsCollection);
    return reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const addReview = async (reviewData) => {
  try {
    const reviewsCollection = collection(db, 'reviews');

    const newReview = {
      author: reviewData.author,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };

    console.log("Saved:", newReview);

    const docRef = await addDoc(reviewsCollection, newReview);
    console.log("Review shared with ID:", docRef.id);
    return { success: true, id: docRef.id };

  } catch (error) {
    console.error("Error saving review", error);
    return { success: false, error: error.message };
  }
};

export const getReviewById = async (id) => {
  try {
    const reviewRef = doc(db, 'reviews', id);
    const reviewSnap = await getDoc(reviewRef);
    
    if (reviewSnap.exists()) {
      return { success: true, data: { id: reviewSnap.id, ...reviewSnap.data() } };
    } else {
      return { success: false, error: "Review no encontrada" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateReview = async (id, updatedData) => {
  try {
    const reviewRef = doc(db, 'reviews', id);
    
    
    await updateDoc(reviewRef, {
      author: updatedData.author,
      rating: updatedData.rating,
      comment: updatedData.comment,
    });
      
    return { success: true };
    
  } catch (error) {
    console.error("Error updating:", error);
    return { success: false, error: error.message };
  }
};

export const deleteReview = async (id) => {
  try {
    const reviewRef = doc(db, 'reviews', id);
    await deleteDoc(reviewRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting:", error);
    return { success: false, error: error.message };
  }
};

export const updateReviewRating = async (id, newRating) => {
  try {
    const reviewRef = doc(db, 'reviews', id);
    await updateDoc(reviewRef, {
      rating: newRating
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};