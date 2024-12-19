// MOCK ERROR

export default class MockError extends Error {
    message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }
}