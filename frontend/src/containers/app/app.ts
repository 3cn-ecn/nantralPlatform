// configure axios
import axios from "axios";
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// imports
import registerSw from "./registerSw";
import loadNotificationMenu from "../notification/notificationMenu";
//import loadBackButton from "./backButton";
import redirectToLoginPage from "./redirectToLoginPage";

// play the code
registerSw();
loadNotificationMenu();
//loadBackButton();
redirectToLoginPage();