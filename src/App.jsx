import { Navbar, Welcome, Dock } from "#components";
import { TerminalWindow } from "#windows";
import gsap from "gsap";

import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar></Navbar>
      <Welcome></Welcome>
      <Dock></Dock>

      <TerminalWindow></TerminalWindow>
    </main>
  );
};

export default App;
