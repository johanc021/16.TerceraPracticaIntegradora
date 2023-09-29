export class SaveSessionCurrentDTO {
    constructor(payload) {
        this.name = payload.name;
        this.email = payload.email;
    }
}
