import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {InsuranceSimulation} from '../domain/model/insurance-simulation.entity';
import {InsuranceSimulationResource, InsuranceSimulationsResponse} from './insurance-simulations-response';
import {InsuranceSimulationAssembler} from './insurance-simulation-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderInsuranceSimulationsEndpointPath}`;

export class InsuranceSimulationsApiEndpoint
  extends BaseApiEndpoint<InsuranceSimulation, InsuranceSimulationResource, InsuranceSimulationsResponse, InsuranceSimulationAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new InsuranceSimulationAssembler());
  }
}
