"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
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
        console.log([...this.clients.keys()].length);
    }
    removeClientById(id) {
        const client = this.getClientById(id);
        if (!client)
            return false;
        this.clients.delete(id);
        console.log([...this.clients.keys()].length);
        return true;
    }
    generateClientId(generateClientId) {
        const generateId = generateClientId ? generateClientId : v4_1.default;
        let clientId = generateId();
        while (this.getClientById(clientId)) {
            clientId = generateId();
        }
        return clientId;
    }
}
exports.Room = Room;
