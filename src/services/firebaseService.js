import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, provider } from './Firebase';



export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};



const REVIEWS_COLLECTION = 'reviews';

export const getReviews = async () => {
    try {
        const reviewsCollection = collection(db, REVIEWS_COLLECTION);
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
        const reviewsCollection = collection(db, REVIEWS_COLLECTION);
        const rating = Number(reviewData.rating);
        const newReview = {
            author: reviewData.author || 'Anonymous',
            rating: isNaN(rating) ? 5 : rating,
            comment: reviewData.comment || '',
            date: reviewData.date || new Date().toISOString().split('T')[0],
        };
        const docRef = await addDoc(reviewsCollection, newReview);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving review:", error);
        return { success: false, error: error.message };
    }
};

export const updateReview = async (id, updatedData) => {
    try {
        const reviewRef = doc(db, REVIEWS_COLLECTION, id);
        await updateDoc(reviewRef, {
            author: updatedData.author,
            rating: Number(updatedData.rating),
            comment: updatedData.comment,
            date: updatedData.date
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating review:", error);
        return { success: false, error: error.message };
    }
};

export const deleteReview = async (id) => {
    try {
        const reviewRef = doc(db, REVIEWS_COLLECTION, id);
        await deleteDoc(reviewRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting review:", error);
        return { success: false, error: error.message };
    }
};

