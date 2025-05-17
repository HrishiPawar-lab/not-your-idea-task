class ApiError extends Error {
    constructor(message) {
        super(message);
        this.status = false;
        this.data = [];
        this.message = message || "Something went wrong"
    }
}

export default ApiError;