"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
exports.default = ({ config, realm }) => {
    const app = express_1.default.Router();
    app.get("/id", (_, res) => {
        res.contentType("html");
        res.send(realm.generateClientId(config.generateClientId));
    });
    app.get("/knock", ({ query }, res) => {
        const room = realm.getRoomByName(query.roomName);
        return res.send(room ? true : false);
    });
    return app;
};
