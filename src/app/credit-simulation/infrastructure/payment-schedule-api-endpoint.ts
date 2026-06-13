import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {PaymentScheduleEntry} from '../domain/model/payment-schedule-entry.entity';
import {PaymentScheduleResource, PaymentScheduleResponse} from './payment-schedule-response';
import {PaymentScheduleAssembler} from './payment-schedule-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderPaymentScheduleEndpointPath}`;

export class PaymentScheduleApiEndpoint
  extends BaseApiEndpoint<PaymentScheduleEntry, PaymentScheduleResource, PaymentScheduleResponse, PaymentScheduleAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new PaymentScheduleAssembler());
  }
}
