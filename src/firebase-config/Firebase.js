import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc} from 'firebase/firestore';

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