import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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