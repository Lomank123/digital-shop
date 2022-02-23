// Routes

// Can be used as id url param
export const idValues = ':id([0-9]+)';
// If you're using regex and see a backslash '\' then add another backslash otherwise regex won't work in some cases
export const resetValues = ':uid([0-9A-Za-z_\\-]+)/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})';

// Auth
export const authRoute = 'auth';
export const signupRoute = 'signup';
export const signupConfirmValues = ':key([-:\\w]+)';
export const confirmRoute = 'confirm';
export const loginRoute = 'login';
export const logoutRoute = 'logout';
export const forgotRoute = 'forgot';
export const emailSentRoute = 'email-sent';
export const resetRoute = 'reset';
export const loggedInRoute = 'loggedin';
export const testRoute = 'test';

// User
export const profileRoute = 'profile';
export const editProfileRoute = `${profileRoute}/edit`;

// Order
export const ordersRoute = 'orders';

// Product
export const productRoute = 'product';
export const addProductRoute = `${productRoute}/add`;
export const editProductRoute = `${productRoute}/edit`;

export const purchaseRoute = 'purchase';
export const cartRoute = 'cart';