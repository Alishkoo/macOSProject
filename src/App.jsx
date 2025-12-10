import { Navbar, Welcome, Dock, LockScreen } from "#components";
import { TerminalWindow, SafariWindow } from "#windows";
import { useEffect } from "react";
import useAuthStore from "./store/auth.js";
import gsap from "gsap";

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

const App = () => {
  const { user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <main className="flex items-center justify-center">
        <div className="text-white text-2xl font-georama">Loading...</div>
      </main>
    );
  }

  return (
    <main>
      {!user && <LockScreen />}

      <Navbar></Navbar>
      <Welcome></Welcome>
      <Dock></Dock>

      <TerminalWindow></TerminalWindow>
      <SafariWindow></SafariWindow>
    </main>
  );
};

export default App;
