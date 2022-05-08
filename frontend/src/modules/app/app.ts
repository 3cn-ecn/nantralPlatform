import registerSw from "./registerSw";
import redirectToLoginPage from "./redirectToLoginPage";
import addAppInstallListener from "./appInstallBanner";
import loadNotificationMenu from "../notification/notificationMenu";
//import loadBackButton from "./backButton";

// configure axios


// load all components
registerSw();
redirectToLoginPage();
addAppInstallListener();
loadNotificationMenu();
//loadBackButton();