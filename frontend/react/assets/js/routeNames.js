// Route names
export const signupRoute = 'signup';
export const signupConfirmValues = ':key([-:\\w]+)';
export const confirmRoute = 'confirm';
export const loginRoute = 'login';
export const logoutRoute = 'logout';
export const forgotRoute = 'forgot';
export const emailSentRoute = 'email-sent';
export const resetRoute = 'reset';
// If you're using regex and see a backslash '\' then add another backslash otherwise regex won't work in some cases
export const resetValues = ':uid([0-9A-Za-z_\\-]+)/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})';
export const loggedInRoute = 'loggedin';
export const resetWithUidRoute = 'signup';
export const testRoute = 'test';
