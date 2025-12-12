import { WindowWrapper } from "#components";
import WindowControlls from "#components/WindowControlls.jsx";
import ContactContent from "../contact/ContactContent";

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControlls target="contact" />
        <h2>Contact</h2>
      </div>

      <div className="h-[500px] overflow-hidden">
        <ContactContent />
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");

export default ContactWindow;
