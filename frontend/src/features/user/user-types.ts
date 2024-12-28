/**
 * Interface representing the data for a User.
 * 
 * @interface User 
 * @property {string} id - UUID of a user.
 * @property {string} username - The username of a user.
 */
export default interface User {
    id: string;
    username: string;
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
/**
 * Interface representing the data returned by the API client following a login request.
 * 
 * @interface LoginResponse
 * @property {string} token - JWT token to authenticate subsequent
 * requests.
 * @property {User} user - The object representing the logged in user.
 */
export interface LoginResponse {
    token: string;
    user: User;
}

export interface SignUpData {
    username: string,
    password: string,
}