import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {InsuranceType} from '../domain/model/insurance-type.entity';
import {InsuranceTypeResource, InsuranceTypesResponse} from './insurance-types-response';
import {InsuranceTypeAssembler} from './insurance-type-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderInsuranceTypesEndpointPath}`;

export class InsuranceTypesApiEndpoint
  extends BaseApiEndpoint<InsuranceType, InsuranceTypeResource, InsuranceTypesResponse, InsuranceTypeAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new InsuranceTypeAssembler());
  }
}
