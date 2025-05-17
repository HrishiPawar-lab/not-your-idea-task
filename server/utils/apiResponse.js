export default class ApiResponse {
    constructor(ok, data = {}, message = '') {
        this.status = ok ? true : false;
        this.data = data;
        this.message = message;
    }
}
