"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
class Room {
    constructor() {
        this.clients = new Map();
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
