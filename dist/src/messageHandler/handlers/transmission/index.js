"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../../enums");
exports.TransmissionHandler = ({ realm }) => {
    const handle = (client, message) => {
        const type = message.type;
        const srcId = message.src;
        const dstId = message.dst;
        const room = realm.getRoomByClientId(dstId);
        const destinationClient = room.getClientById(dstId);
        // User is connected!
        if (destinationClient) {
            const socket = destinationClient.getSocket();
            try {
                if (socket) {
                    const data = JSON.stringify(message);
                    if (type === enums_1.MessageType.KNOCK) {
                        const knockRoomName = message.payload.roomName;
                        const knockRoom = realm.getRoomByName(knockRoomName);
                        socket.send(JSON.stringify({
                            type: enums_1.MessageType.KNOCK_REPLY,
                            payload: {
                                roomName: knockRoomName,
                                isExists: knockRoom ? true : false,
                                isRequiredPassword: knockRoom ? knockRoom.getRequiredPassword() : false
                            }
                        }));
                    }
                    else if (type === enums_1.MessageType.SET_PASSWORD) {
                        const newPassword = message.payload.password;
                        room.setPassword(newPassword);
                        room.getClients().forEach(otherClient => {
                            handle(otherClient, {
                                type: enums_1.MessageType.PASSWORD_CHANGED,
                                src: destinationClient.getId(),
                                dst: otherClient.getId(),
                                payload: {
                                    remove: newPassword ? false : true
                                }
                            });
                        });
                    }
                    else {
                        socket.send(data);
                    }
                }
                else {
                    // Neither socket no res available. Peer dead?
                    throw new Error("Peer dead");
                }
            }
            catch (e) {
                // This happens when a peer disconnects without closing connections and
                // the associated WebSocket has not closed.
                // Tell other side to stop trying.
                if (socket) {
                    socket.close();
                }
                else {
                    room.removeClientById(destinationClient.getId());
                    if (room.getClientsIds().length === 0) {
                        realm.removeRoomByName(room.getName());
                    }
                }
                handle(client, {
                    type: enums_1.MessageType.LEAVE,
                    src: dstId,
                    dst: srcId
                });
            }
        }
        else {
            // Wait for this client to connect/reconnect (XHR) for important
            // messages.
            const ignoredTypes = [enums_1.MessageType.LEAVE, enums_1.MessageType.EXPIRE];
            if (!ignoredTypes.includes(type) && dstId) {
                realm.addMessageToQueue(dstId, message);
            }
            else if (type === enums_1.MessageType.LEAVE && !dstId) {
                room.removeClientById(srcId);
                if (room.getClientsIds().length === 0) {
                    realm.removeRoomByName(room.getName());
                }
            }
            else {
                // Unavailable destination specified with message LEAVE or EXPIRE
                // Ignore
            }
        }
        return true;
    };
    return handle;
};
