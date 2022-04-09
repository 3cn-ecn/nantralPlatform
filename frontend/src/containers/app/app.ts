import axios from "../utils/axios";
import registerSw from "./registerSw";
import loadNotificationMenu from "../notification/notificationMenu";
import redirectToLoginPage from "./redirectToLoginPage";
//import loadBackButton from "./backButton";

// configure axios


// load all components
registerSw();
loadNotificationMenu();
redirectToLoginPage();
//loadBackButton();