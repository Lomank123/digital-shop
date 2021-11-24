// main urls
const portNum = 8000;
const frontPortNum = 9000;
const hostURL = 'http://127.0.0.1:' + portNum + '/';
const localhostURL = 'http://localhost:' + frontPortNum + '/';

// Api urls
export const apiURL = hostURL + 'api/';

// Token urls
export const tokenGetURL = apiURL + 'token/';
export const tokenRefreshURL = tokenGetURL + 'refresh/';

export const apiRestAuthURL = apiURL + 'rest-auth/';
export const signupURL = apiRestAuthURL + 'registration/';
export const getEntities = apiURL + 'entities/';

// Password reset
export const passwordResetURL = apiRestAuthURL + 'password/' + 'reset/';
export const passwordResetConfirmURL = passwordResetURL + 'confirm/';

// Auth urls
export const loginURL = localhostURL + 'login/';

// Password reset url:
// http://example.com/reset/Mg/awg98z-1f4aa9090b55ec597c9cdefff6e65f31/
// regex for last 2 args: (?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$
// Change example.com to heroku app inside sites in django admin dashboard
// To test you should replace example.com with "localhost:9000"