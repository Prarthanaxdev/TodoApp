import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const provider = new firebase.auth.GoogleAuthProvider();

const firebaseConfig = {
    apiKey: "AIzaSyD6lcRnk_hbBf3xDMhPZCX5rK9JaSsSVAM",
    authDomain: "test-47c34.firebaseapp.com",
    projectId: "test-47c34",
    storageBucket: "test-47c34.appspot.com",
    messagingSenderId: "20668071512",
    appId: "1:20668071512:web:6ff676ba9700d31b95d42d",
    measurementId: "G-PXTCZDMMCK"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();


export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
};

export const signOut = () => {
    auth.signInWithRedirect(provider);
};

export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const { email, displayName, photoURL } = user;

        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();
        return {
            uid,
            ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};

