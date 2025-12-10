import { WindowWrapper } from "#components";
import WindowControlls from "#components/WindowControlls.jsx";

const Safari = () => {
  return (
    <>
      <div id="window-header">
        <WindowControlls target="safari" />
        <h2>Safari Browser</h2>
      </div>

      <div className="bg-white p-10 min-h-[400px] flex items-center justify-center">
        <h1 className="text-4xl font-georama text-gray-800">Hello World</h1>
      </div>
    </>
  );
};

const SafariWindow = WindowWrapper(Safari, "safari");

export default SafariWindow;
