"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_CHECK_INTERVAL = 300;
class CheckBrokenConnections {
    constructor({ realm, config, checkInterval = DEFAULT_CHECK_INTERVAL, onClose }) {
        this.timeoutId = null;
        this.realm = realm;
        this.config = config;
        this.onClose = onClose;
        this.checkInterval = checkInterval;
    }
    start() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
            this.checkConnections();
            this.timeoutId = null;
            this.start();
        }, this.checkInterval);
    }
    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
    checkConnections() {
        var _a, _b;
        const rooms = this.realm.getRooms();
        const now = new Date().getTime();
        const { alive_timeout: aliveTimeout } = this.config;
        for (const room of rooms) {
            const clientsIds = room.getClientsIds();
            for (const clientId of clientsIds) {
                const client = room.getClientById(clientId);
                const timeSinceLastPing = now - client.getLastPing();
                if (timeSinceLastPing < aliveTimeout)
                    continue;
                try {
                    (_a = client.getSocket()) === null || _a === void 0 ? void 0 : _a.close();
                }
                finally {
                    this.realm.clearMessageQueue(clientId);
                    room.removeClientById(clientId);
                    client.setSocket(null);
                    (_b = this.onClose) === null || _b === void 0 ? void 0 : _b.call(this, client);
                }
            }
        }
    }
}
exports.CheckBrokenConnections = CheckBrokenConnections;
