"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor({ name }) {
        this.clients = new Map();
        this.name = name;
        this.password = "test";
    }
    getName() {
        return this.name;
    }
    getRequiredPassword() {
        return this.name !== "__global__" && this.password ? true : false;
    }
    validatePassword(password) {
        return !this.getRequiredPassword() || this.password === password;
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
}
exports.Room = Room;
