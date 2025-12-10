import useWindowStore from "#store/window.js";

const WindowControlls = () => {
  const { closeWindow } = useWindowStore();

  return (
    <div id="window-controls">
      <div className="close" onClick={() => closeWindow("terminal")}></div>
      <div className="minimize"></div>
      <div className="maximize"></div>
    </div>
  );
};

export default WindowControlls;
