// mock backend controllers for User.
// NOTE: this is only for development purposes.
// USELESS once backend is set up.

import NotFoundError from "../common/errors/MockError";
import { User, LoginData, LoginResponse, SignUpData} from "../features/user/user-types";

interface backendUser {
    id: number;
    username: string;
    password: string;
};

// HARDCODED
const USERS: backendUser[] = [
    {
        id: 1,
        username: "peanutman",
        password: "pw",
    },
    {
        id: 2,
        username: "meowmeowmeowmeow",
        password: "pw",
    },
    {
        id: 3,
        username: "boing",
        password: "pw",
    },
]

// mock controller for GET API_BASE_URL/user/:userId
const getUserById = async (userId: number): Promise<User> => {
    // TODO: replace with actual API call
    const user = USERS.find(u => u.id === userId);

    // throw error if user doesn't exist.
    if (!user) {
        throw new NotFoundError("User");
    } else {
        return user;
    }
}

// mock controller for POST API_BASE_URL/user
const createUser = async (content: SignUpData): Promise<User> => {
    const newId = Math.max(...USERS.map(user => user.id));
                        
    const newUser = {
        id: newId,
        username: content.username,
        password: content.password,
    } 

    USERS.push(newUser);

    return {
        id: newUser.id,
        username: newUser.username,
        token: "",
    }
}

// mock controller for POST API_BASE_URL/user/login
const login = async (credentials: LoginData): Promise<LoginResponse> => {
    const user = USERS.find(user => user.password === credentials.password && user.username === credentials.username);

    if (user) {
        return {
            user: { id: user.id, username: user.username, token: "mock-jwt-token" },
            token: "mock-jwt-token",
        }
    } else {
        throw {
            status: 401,
            message: "Invalid username or password",
        };
    };
} 

export default {
    getUserById,
    createUser,
    login,
}