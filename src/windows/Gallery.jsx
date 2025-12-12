import { WindowWrapper } from "#components";
import WindowControlls from "#components/WindowControlls.jsx";
import GalleryContent from "../gallery/GalleryContent";

const Gallery = () => {
  return (
    <>
      <div id="window-header">
        <WindowControlls target="photos" />
        <h2>Gallery</h2>
      </div>

      <div className="h-[500px] overflow-hidden">
        <GalleryContent />
      </div>
    </>
  );
};

const GalleryWindow = WindowWrapper(Gallery, "photos");

export default GalleryWindow;
