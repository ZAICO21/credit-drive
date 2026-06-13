import {BaseApi} from '../../shared/infrastructure/base-api';
import {ClientsApiEndpoint} from './clients-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Client} from '../domain/model/client.entity';

@Injectable({providedIn: 'root'})
export class ClientApi extends BaseApi {
  private readonly clientsEndpoint: ClientsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.clientsEndpoint = new ClientsApiEndpoint(http);
  }

  getClients() {
    return this.clientsEndpoint.getAll();
  }

  getClientById(id: string) {
    return this.clientsEndpoint.getById(id);
  }

  createClient(client: Client) {
    return this.clientsEndpoint.create(client);
  }

  updateClient(client: Client) {
    return this.clientsEndpoint.update(client, client.id);
  }

  deleteClient(id: string) {
    return this.clientsEndpoint.delete(id);
  }
}
