// NOTE: this is only for development purposes.
// USELESS once backend is set up.

import User from "../types/User"
import NotFoundError from "../common/errors/MockError";

// HARDCODED
const USERS = [
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

export const getUserById = async (userId: number): Promise<User> => {
    // TODO: replace with actual API call
    const user = USERS.find(u => u.id === userId);

    // throw error if user doesn't exist.
    if (!user) {
        throw new NotFoundError("User");
    } else {
        return user;
    }
}