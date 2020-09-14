"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const room_1 = require("./room");
const messageQueue_1 = require("./messageQueue");
class Realm {
    constructor() {
        this.rooms = new Map();
        this.messageQueues = new Map();
    }
    getRooms() {
        return [...this.rooms.values()];
    }
    getRoomByName(roomName) {
        return this.rooms.get(roomName);
    }
    getRoomByClientId(clientId) {
        for (const room of this.rooms.values()) {
            if (room.getClientById(clientId))
                return room;
        }
    }
    getOrGenerateRoomByName(roomName) {
        const room = this.rooms.get(roomName);
        if (room) {
            return room;
        }
        else {
            const newRoomName = roomName ? roomName : "__global__";
            const newRoom = new room_1.Room({ name: newRoomName });
            this.rooms.set(roomName, newRoom);
            return newRoom;
        }
    }
    removeRoomByName(roomName) {
        const room = this.getRoomByName(roomName);
        if (!room)
            return false;
        this.rooms.delete(roomName);
        return true;
    }
    getClientsIdsWithQueue() {
        return [...this.messageQueues.keys()];
    }
    getMessageQueueById(id) {
        return this.messageQueues.get(id);
    }
    addMessageToQueue(id, message) {
        if (!this.getMessageQueueById(id)) {
            this.messageQueues.set(id, new messageQueue_1.MessageQueue());
        }
        this.getMessageQueueById(id).addMessage(message);
    }
    clearMessageQueue(id) {
        this.messageQueues.delete(id);
    }
    generateClientId(generateClientId) {
        const generateId = generateClientId ? generateClientId : v4_1.default;
        let clientId = generateId();
        const rooms = this.getRooms();
        for (const room of rooms) {
            if (room.getClientById(clientId)) {
                clientId = generateId();
            }
        }
        return clientId;
    }
}
exports.Realm = Realm;
