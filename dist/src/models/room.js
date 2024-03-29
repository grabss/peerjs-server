"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor({ name }) {
        this.clients = new Map();
        this.name = name;
        this.password = "";
    }
    getName() {
        return this.name;
    }
    isRequiredPassword() {
        return !this.isGlobal() && this.password ? true : false;
    }
    validatePassword(password) {
        return !this.isRequiredPassword() || this.password === password;
    }
    setPassword(password) {
        this.password = password;
    }
    getClientsIds() {
        return [...this.clients.keys()];
    }
    getClientById(clientId) {
        return this.clients.get(clientId);
    }
    getClients() {
        return [...this.clients.values()];
    }
    setClient(client, id) {
        this.clients.set(id, client);
    }
    removeClientById(id) {
        const client = this.getClientById(id);
        if (!client)
            return false;
        this.clients.delete(id);
        return true;
    }
    isGlobal() {
        return this.name === "__global__";
    }
}
exports.Room = Room;
