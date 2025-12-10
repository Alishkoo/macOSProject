import { WindowWrapper } from "#components";
import WindowControlls from "#components/WindowControlls.jsx";
import SafariBrowser from "../safari/components/SafariBrowser";

const Safari = () => {
  return (
    <>
      <div id="window-header">
        <WindowControlls target="safari" />
        <h2>Safari Browser</h2>
      </div>

      <div className="h-[600px] overflow-hidden">
        <SafariBrowser />
      </div>
    </>
  );
};

const SafariWindow = WindowWrapper(Safari, "safari");

export default SafariWindow;
