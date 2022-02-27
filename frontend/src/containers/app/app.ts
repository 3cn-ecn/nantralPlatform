import axios from "axios";
import registerSw from "./registerSw";
import loadNotificationMenu from "../notification/notificationMenu";
import redirectToLoginPage from "./redirectToLoginPage";
//import loadBackButton from "./backButton";

// configure axios
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// load all components
registerSw();
loadNotificationMenu();
redirectToLoginPage();
//loadBackButton();