import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
        return { success: false, error: error.message };
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
        set((state) => {
          state.error = error.message;
          state.loading = false;
        });
        return { success: false, error: error.message };
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
