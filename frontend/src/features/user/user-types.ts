/**
 * Interface representing the data for a User.
 * 
 * @interface User 
 * @property {number} id - UUID of a user.
 * @property {string} usernamme - The username of a user.
 * @property {string} hashedPassword - the hashed password of a user.
 */
export interface User {
    id: number;
    username: string;
    hashedPassword: string;
}

/**
 * NOTE:
 * Interface for login data
 * that will be used as the body
 * of the POST request of our API auth endpoint.
 * Hence, data type MUST match the expected type of the API endpoint.
 * 
 * Interface representing the data required for a login request.
 *
 * This interface is used to define the shape of the data when a user
 * submits their login credentials, including their username and password.
 *
 * @interface LoginData
 * @property {string} username - The username of the user attempting to log in.
 * @property {string} password - The password of the user attempting to log in.
 */
export interface LoginData {
    username: string,
    password: string,
}

// TODO: replace with the ACTUAL type of the backend login response.
// Including wtv cookies and stuff
export interface LoginResponse {
    token: string;
    user: User;
}