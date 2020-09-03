"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            const newRoom = new room_1.Room({ name: roomName });
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
}
exports.Realm = Realm;
