import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../config/firebase";

const handleAuthError = (error) => {
  console.error("Firebase Auth Error Code:", error.code);
  switch (error.code) {
    case "auth/invalid-email":
      return "The email address is badly formatted.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "The password is too weak. Must be at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    default:
      return error.message || "An unexpected error occurred. Please try again.";
  }
};

const authService = {
  register: async ({ fullName, email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Save user to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        userid: userCredential.user.uid,
        email: email,
        role: "user",
        createdAt: new Date(),
      });

      return userCredential.user;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  login: async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Check user role in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "user") {
        await signOut(auth);
        throw new Error("Invalid email or password. Please try again");
      }

      return userCredential.user;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  googleLogin: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Save or update user in Firestore
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          userid: result.user.uid,
          email: result.user.email,
          role: "user",
          createdAt: new Date(),
        },
        { merge: true },
      );

      // Check user role in Firestore
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.data().role !== "user") {
        await signOut(auth);
        throw new Error("Invalid email or password. Please try again");
      }

      return result.user;
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },

  subscribeToAuthChanges: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  sendPasswordReset: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(handleAuthError(error));
    }
  },
};

export default authService;
