import uuidv4 from "uuid/v4";
import { IClient } from "./client";

export interface IRoom {
  getClientsIds(): string[];

  getClientById(clientId: string): IClient | undefined;

  setClient(client: IClient, id: string): void;

  removeClientById(id: string): boolean;

  generateClientId(generateClientId?: () => string): string;
}

export class Room implements IRoom {
  private readonly clients: Map<string, IClient> = new Map();

  public getClientsIds(): string[] {
    return [...this.clients.keys()];
  }

  public getClientById(clientId: string): IClient | undefined {
    return this.clients.get(clientId);
  }

  public setClient(client: IClient, id: string): void {
    this.clients.set(id, client);
  }

  public removeClientById(id: string): boolean {
    const client = this.getClientById(id);

    if (!client) return false;

    this.clients.delete(id);

    return true;
  }

  public generateClientId(generateClientId?: () => string): string {

    const generateId = generateClientId ? generateClientId : uuidv4;

    let clientId = generateId();

    while (this.getClientById(clientId)) {
      clientId = generateId();
    }

    return clientId;
  }
}
