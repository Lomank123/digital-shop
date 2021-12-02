// main urls
const portNum = 8000;
const hostURL = 'http://127.0.0.1:' + portNum + '/';

// Unused
//const frontPortNum = 9000;
//const localhostURL = 'http://localhost:' + frontPortNum + '/';

// Api urls
export const apiURL = hostURL + 'api/';

export const apiRestAuthURL = apiURL + 'dj-rest-auth/';
export const userGetURL = apiRestAuthURL + 'user/'
export const signupURL = apiRestAuthURL + 'registration/';
export const getEntities = apiURL + 'entities/';

// Token urls
export const tokenGetURL = apiRestAuthURL + 'login/';
export const tokenRefreshURL = apiRestAuthURL + 'token/' + 'refresh/';
export const tokenVerifyURL = apiURL + 'verify-tokens/';

// Password reset
export const passwordResetURL = apiRestAuthURL + 'password/' + 'reset/';
export const passwordResetConfirmURL = passwordResetURL + 'confirm/';

// Auth urls
export const loginURL = '/login/';
export const loggedinURL = '/loggedin/';
// Password reset url:
// http://example.com/reset/Mg/awg98z-1f4aa9090b55ec597c9cdefff6e65f31/
// regex for last 2 args: (?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$
// Change example.com to heroku app inside sites in django admin dashboard
// To test you should replace example.com with "localhost:9000"