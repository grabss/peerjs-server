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
            const newRoom = new room_1.Room();
            this.rooms.set(roomName, newRoom);
            return newRoom;
        }
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
