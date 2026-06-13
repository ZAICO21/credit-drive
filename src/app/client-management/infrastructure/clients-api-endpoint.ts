import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Client} from '../domain/model/client.entity';
import {ClientResource, ClientsResponse} from './clients-response';
import {ClientAssembler} from './client-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderClientsEndpointPath}`;

export class ClientsApiEndpoint
  extends BaseApiEndpoint<Client, ClientResource, ClientsResponse, ClientAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new ClientAssembler());
  }
}
