import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Simulation} from '../domain/model/simulation.entity';
import {SimulationResource, SimulationsResponse} from './simulations-response';
import {SimulationAssembler} from './simulation-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSimulationsEndpointPath}`;

export class SimulationsApiEndpoint
  extends BaseApiEndpoint<Simulation, SimulationResource, SimulationsResponse, SimulationAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new SimulationAssembler());
  }
}
