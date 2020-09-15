import { IClient } from "./client";

export interface IRoom {
  getName(): string;

  isRequiredPassword(): boolean;

  validatePassword(password: string): boolean;

  setPassword(password: string): void;

  getClientsIds(): string[];

  getClientById(clientId: string): IClient | undefined;

  getClients(): IClient[];

  setClient(client: IClient, id: string): void;

  removeClientById(id: string): boolean;

  isGlobal(): boolean;
}

export class Room implements IRoom {
  private readonly name: string;
  private password: string;
  private readonly clients: Map<string, IClient> = new Map();

  constructor({ name }: { name: string }) {
    this.name = name;
    this.password = "";
  }

  public getName(): string {
    return this.name;
  }

  public isRequiredPassword(): boolean {
    return !this.isGlobal() && this.password ? true : false
  }

  public validatePassword(password: string): boolean {
    return !this.isRequiredPassword() || this.password === password;
  }

  public setPassword(password: string): void {
    this.password = password
  }

  public getClientsIds(): string[] {
    return [...this.clients.keys()];
  }

  public getClientById(clientId: string): IClient | undefined {
    return this.clients.get(clientId);
  }

  public getClients(): IClient[] {
    return [...this.clients.values()];
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

  public isGlobal(): boolean {
    return this.name === "__global__";
  }
}
