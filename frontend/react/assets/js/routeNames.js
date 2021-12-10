// Route names
export const authRoute = 'auth';
export const signupRoute = authRoute + '/' + 'signup';
export const signupConfirmValues = ':key([-:\\w]+)';
export const confirmRoute = 'confirm';
export const loginRoute = authRoute + '/' + 'login';
export const logoutRoute = authRoute + '/' + 'logout';
export const forgotRoute = authRoute + '/' + 'forgot';
export const emailSentRoute = 'email-sent';
export const resetRoute = authRoute + '/' + 'reset';
// If you're using regex and see a backslash '\' then add another backslash otherwise regex won't work in some cases
export const resetValues = ':uid([0-9A-Za-z_\\-]+)/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})';
export const loggedInRoute = authRoute + '/' + 'loggedin';
export const testRoute = 'test';


