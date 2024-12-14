export default class NotFoundError extends Error {
    constructor(itemName: string) {
        super(`${itemName} not found.`);
    }
}