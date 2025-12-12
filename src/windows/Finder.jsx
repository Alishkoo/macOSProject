import { WindowWrapper } from "#components";
import WindowControlls from "#components/WindowControlls.jsx";
import FinderContent from "../finder/FinderContent";

const Finder = () => {
  return (
    <>
      <div id="window-header">
        <WindowControlls target="finder" />
        <h2>Finder</h2>
      </div>

      <div className="h-[500px] overflow-hidden">
        <FinderContent />
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
