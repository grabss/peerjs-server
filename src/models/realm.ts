import uuidv4 from "uuid/v4";
import { Room, IRoom } from "./room";
import { IMessage } from "./message";
import { IMessageQueue, MessageQueue } from "./messageQueue";

export interface IRealm {
  getRooms(): IRoom[];

  getRoomByName(roomName: string): IRoom | undefined;

  getRoomByClientId(clientId: string): IRoom | undefined;

  getOrGenerateRoomByName(roomName: string): IRoom;

  removeRoomByName(id: string): boolean;

  getClientsIdsWithQueue(): string[];

  getMessageQueueById(id: string): IMessageQueue | undefined;

  addMessageToQueue(id: string, message: IMessage): void;

  clearMessageQueue(id: string): void;

  generateClientId(generateClientId?: () => string): string;
}

export class Realm implements IRealm {
  private readonly rooms: Map<string, IRoom> = new Map();
  private readonly messageQueues: Map<string, IMessageQueue> = new Map();

  public getRooms(): IRoom[] {
    return [...this.rooms.values()];
  }

  public getRoomByName(roomName: string) {
    return this.rooms.get(roomName)
  }

  public getRoomByClientId(clientId: string) {
    for (const room of this.rooms.values()) {
      if (room.getClientById(clientId)) return room
    }
  }

  public getOrGenerateRoomByName(roomName: string): IRoom {
    const room = this.rooms.get(roomName);
    if (room) {
      return room;
    } else {
      const newRoom: IRoom = new Room({ name: roomName });
      this.rooms.set(roomName, newRoom);
      return newRoom;
    }
  }

  public removeRoomByName(roomName: string): boolean {
    const room = this.getRoomByName(roomName);

    if (!room) return false;

    this.rooms.delete(roomName);

    return true;
  }

  public getClientsIdsWithQueue(): string[] {
    return [...this.messageQueues.keys()];
  }

  public getMessageQueueById(id: string): IMessageQueue | undefined {
    return this.messageQueues.get(id);
  }

  public addMessageToQueue(id: string, message: IMessage): void {
    if (!this.getMessageQueueById(id)) {
      this.messageQueues.set(id, new MessageQueue());
    }

    this.getMessageQueueById(id)!.addMessage(message);
  }

  public clearMessageQueue(id: string): void {
    this.messageQueues.delete(id);
  }

  public generateClientId(generateClientId?: () => string): string {

    const generateId = generateClientId ? generateClientId : uuidv4;

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
