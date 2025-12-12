import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config.js";

const useAuthStore = create(
  immer((set) => ({
    user: null,
    loading: true,
    error: null,

    
    initializeAuth: () => {
      onAuthStateChanged(auth, (user) => {
        set((state) => {
          state.user = user;
          state.loading = false;
        });
      });
    },

    
    signUp: async (email, password) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        set((state) => {
          state.user = userCredential.user;
          state.loading = false;
        });
        return { success: true };
      } catch (error) {
        let errorMessage = error.message;
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Use at least 6 characters.';
        }
        
        set((state) => {
          state.error = errorMessage;
          state.loading = false;
        });
        return { success: false, error: errorMessage };
      }
    },


    signIn: async (email, password) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        set((state) => {
          state.user = userCredential.user;
          state.loading = false;
        });
        return { success: true };
      } catch (error) {
        let errorMessage = error.message;
        
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email. Please sign up first.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password. Please check and try again.';
        }
        
        set((state) => {
          state.error = errorMessage;
          state.loading = false;
        });
        return { success: false, error: errorMessage };
      }
    },

    // Guest Sign In 
    signInAsGuest: async () => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });

      try {
        const userCredential = await signInAnonymously(auth);
        set((state) => {
          state.user = userCredential.user;
          state.loading = false;
        });
        return { success: true };
      } catch (error) {
        let errorMessage = error.message;
        
        
        if (error.code === 'auth/admin-restricted-operation') {
          errorMessage = 'Guest login is currently disabled. Please sign in with email or contact administrator.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Anonymous authentication is not enabled. Please use email/password.';
        }
        
        set((state) => {
          state.error = errorMessage;
          state.loading = false;
        });
        return { success: false, error: errorMessage };
      }
    },

   
    logout: async () => {
      try {
        await signOut(auth);
        set((state) => {
          state.user = null;
          state.error = null;
        });
        return { success: true };
      } catch (error) {
        set((state) => {
          state.error = error.message;
        });
        return { success: false, error: error.message };
      }
    },

 
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);

export default useAuthStore;
