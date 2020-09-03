"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor({ name }) {
        this.clients = new Map();
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getClientsIds() {
        return [...this.clients.keys()];
    }
    getClientById(clientId) {
        return this.clients.get(clientId);
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
