"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Errors;
(function (Errors) {
    Errors["INVALID_KEY"] = "Invalid key provided";
    Errors["INVALID_TOKEN"] = "Invalid token provided";
    Errors["INVALID_WS_PARAMETERS"] = "No id, token, or key supplied to websocket server";
    Errors["CONNECTION_LIMIT_EXCEED"] = "Server has reached its concurrent user limit";
    Errors["INVALID_PASSWORD"] = "Invalid room password ";
})(Errors = exports.Errors || (exports.Errors = {}));
var MessageType;
(function (MessageType) {
    MessageType["CONNECT"] = "CONNECT";
    MessageType["OPEN"] = "OPEN";
    MessageType["LEAVE"] = "LEAVE";
    MessageType["CANDIDATE"] = "CANDIDATE";
    MessageType["OFFER"] = "OFFER";
    MessageType["ANSWER"] = "ANSWER";
    MessageType["EXPIRE"] = "EXPIRE";
    MessageType["HEARTBEAT"] = "HEARTBEAT";
    MessageType["ID_TAKEN"] = "ID-TAKEN";
    MessageType["ERROR"] = "ERROR";
    MessageType["KNOCK"] = "KNOCK";
    MessageType["KNOCK_REPLY"] = "KNOCK-REPLY";
    MessageType["ENTER_ROOM"] = "ENTER-ROOM";
    MessageType["SET_PASSWORD"] = "SET-PASSWORD";
    MessageType["PASSWORD_CHANGED"] = "PASSWORD-CHANGED";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
