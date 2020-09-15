import EventEmitter from "events";
import { IncomingMessage } from "http";
import url from "url";
import WebSocketLib from "ws";
import { IConfig } from "../../config";
import { Errors, MessageType } from "../../enums";
import { Client, IClient } from "../../models/client";
import { IRealm } from "../../models/realm";
import { IRoom } from "../../models/room";
import { MyWebSocket } from "./webSocket";

export interface IWebSocketServer extends EventEmitter {
  readonly path: string;
}

interface IAuthParams {
  id?: string;
  token?: string;
  roomName?: string;
  key?: string;
}

type CustomConfig = Pick<IConfig, 'path' | 'key' | 'concurrent_limit'>;

const WS_PATH = 'signaling';

export class WebSocketServer extends EventEmitter implements IWebSocketServer {

  public readonly path: string;
  private readonly realm: IRealm;
  private readonly config: CustomConfig;
  public readonly socketServer: WebSocketLib.Server;

  constructor({ server, realm, config }: { server: any, realm: IRealm, config: CustomConfig; }) {
    super();

    this.setMaxListeners(0);

    this.realm = realm;
    this.config = config;

    const path = this.config.path;
    this.path = `${path}${path.endsWith('/') ? "" : "/"}${WS_PATH}`;

    this.socketServer = new WebSocketLib.Server({ path: this.path, server });

    this.socketServer.on("connection", (socket: MyWebSocket, req) => this._onSocketConnection(socket, req));
    this.socketServer.on("error", (error: Error) => this._onSocketError(error));
  }

  private _onSocketConnection(socket: MyWebSocket, req: IncomingMessage): void {
    const { query = {} } = url.parse(req.url!, true);

    const { id, token, roomName, key }: IAuthParams = query;

    if (!id || !token || !key) {
      return this._sendErrorAndClose(socket, Errors.INVALID_WS_PARAMETERS);
    }

    if (key !== this.config.key) {
      return this._sendErrorAndClose(socket, Errors.INVALID_KEY);
    }

    const room = this.realm.getOrGenerateRoomByName(roomName!);

    const client = room.getClientById(id);

    if (client) {
      if (token !== client.getToken()) {
        // ID-taken, invalid token
        socket.send(JSON.stringify({
          type: MessageType.ID_TAKEN,
          payload: { msg: "ID is taken" }
        }));

        return socket.close();
      }

      return this._configureWS(socket, client, room);
    }

    socket.on("message", (data: WebSocketLib.Data) => {
      const message = JSON.parse(data as string);
      if (message.type === MessageType.ENTER_ROOM) {
        if (room.validatePassword(message.payload.password)) {
          this._registerClient({ socket, id, token, room });
        } else {
          if (room.getClientsIds().length === 0) {
            this.realm.removeRoomByName(room.getName());
          }
          socket.send(JSON.stringify({
            type: MessageType.INVALID_PASSWORD
          }));
          socket.close();
        }
      }
    });

    socket.send(JSON.stringify({ type: MessageType.CONNECT, payload: room.getRequiredPassword() }));
  }

  private _onSocketError(error: Error): void {
    // handle error
    this.emit("error", error);
  }

  private _registerClient({ socket, id, token, room }:
    {
      socket: MyWebSocket;
      id: string;
      token: string;
      room: IRoom;
    }): void {
    // Check concurrent limit
    const clientsCount = room.getClientsIds().length;

    if (clientsCount >= this.config.concurrent_limit) {
      return this._sendErrorAndClose(socket, Errors.CONNECTION_LIMIT_EXCEED);
    }

    const newClient: IClient = new Client({ id, token });
    room.setClient(newClient, id);
    socket.send(JSON.stringify({ type: MessageType.OPEN, payload: room.getClientsIds() }));

    this._configureWS(socket, newClient, room);
  }

  private _configureWS(socket: MyWebSocket, client: IClient, room: IRoom): void {
    client.setSocket(socket);

    // Cleanup after a socket closes.
    socket.on("close", () => {
      if (client.getSocket() === socket) {
        room.removeClientById(client.getId());
        if (room.getClientsIds().length === 0) {
          this.realm.removeRoomByName(room.getName());
        }
        this.emit("close", client, room);
      }
    });

    // Handle messages from peers.
    socket.on("message", (data: WebSocketLib.Data) => {
      try {
        const message = JSON.parse(data as string);

        message.src = client.getId();

        this.emit("message", client, message);
      } catch (e) {
        this.emit("error", e);
      }
    });

    this.emit("connection", client);
  }

  private _sendErrorAndClose(socket: MyWebSocket, msg: Errors): void {
    socket.send(
      JSON.stringify({
        type: MessageType.ERROR,
        payload: { msg }
      })
    );

    socket.close();
  }
}
