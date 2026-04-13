import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, provider } from '../firebase-config/Firebase';

// --- AUTH SERVICES ---

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

// --- FIRESTORE SERVICES (Reviews) ---

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
        const newReview = {
            author: reviewData.author,
            rating: Number(reviewData.rating),
            comment: reviewData.comment,
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

/**
 * Saves multiple reviews at once using batch (max 500 per batch per Firebase limits)
 */
export const saveBulkReviews = async (reviews) => {
    try {
        const batch = writeBatch(db);
        const reviewsRect = collection(db, REVIEWS_COLLECTION);
        
        reviews.forEach((review) => {
            const newDocRef = doc(reviewsRect); // Generate new ID
            batch.set(newDocRef, {
                author: review.author || 'Anonymous',
                rating: Number(review.rating) || 5,
                comment: review.comment || '',
                date: review.date || new Date().toISOString().split('T')[0],
            });
        });

        await batch.commit();
        return { success: true, count: reviews.length };
    } catch (error) {
        console.error("Error in bulk saving:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Deletes all reviews from the collection (DANGEROUS - use for testing)
 */
export const clearAllReviews = async () => {
    try {
        const reviewsCollection = collection(db, REVIEWS_COLLECTION);
        const snapshot = await getDocs(reviewsCollection);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error("Error clearing reviews:", error);
        return { success: false, error: error.message };
    }
};
