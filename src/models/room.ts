import uuidv4 from "uuid/v4";
import { IClient } from "./client";

export interface IRoom {
  getName(): string;

  getClientsIds(): string[];

  getClientById(clientId: string): IClient | undefined;

  setClient(client: IClient, id: string): void;

  removeClientById(id: string): boolean;

  generateClientId(generateClientId?: () => string): string;
}

export class Room implements IRoom {
  private readonly name: string;
  private readonly clients: Map<string, IClient> = new Map();

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public getClientsIds(): string[] {
    return [...this.clients.keys()];
  }

  public getClientById(clientId: string): IClient | undefined {
    return this.clients.get(clientId);
  }

  public setClient(client: IClient, id: string): void {
    this.clients.set(id, client);
    console.log([...this.clients.keys()].length)
  }

  public removeClientById(id: string): boolean {
    const client = this.getClientById(id);

    if (!client) return false;

    this.clients.delete(id);
    console.log([...this.clients.keys()].length)

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
