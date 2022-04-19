/**
 * This module modify axios to set by default the csrftoken,
 * which is necessary to post requests.
 */

import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export default axios;