// mock backend controllers for User.
// NOTE: this is only for development purposes.
// USELESS once backend is set up.

import NotFoundError from "../common/errors/MockError";
import { User, LoginData, LoginResponse} from "../features/user/user-types";

// HARDCODED
const USERS: User[] = [
    {
        id: 1,
        username: "peanutman",
        hashedPassword: "pw",
    },
    {
        id: 2,
        username: "meowmeowmeowmeow",
        hashedPassword: "pw",
    },
    {
        id: 3,
        username: "boing",
        hashedPassword: "pw",
    },
]

// interface for post requests
interface UserPostReq {
    username: "string",
    password: "string",
}

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
const createUser = async (content: UserPostReq): Promise<User> => {
    const newId = Math.max(...USERS.map(user => user.id));
                        
    const newUser = {
        id: newId,
        username: content.username,
        hashedPassword: content.password,
    } 

    USERS.push(newUser);

    return newUser;
}

// mock controller for POST API_BASE_URL/user/login
const login = async (credentials: LoginData): Promise<LoginResponse> => {
    return {
        user: USERS[1],
        token: "",
    }
} 

export default {
    getUserById,
    createUser,
    login,
}