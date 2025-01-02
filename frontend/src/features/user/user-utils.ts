import Cookies from "js-cookie";
import User from "./user-types";

export const storeSessionInCookies = (user: User, token: string) => {
    console.log("storeSessionInCookies");
    Cookies.set('user', JSON.stringify(user));
    Cookies.set('token', token);
}

export const clearSessionInCookies = () => {
    console.log("clearSessionInCookies");
    Cookies.remove('user');
    Cookies.remove('token');
}