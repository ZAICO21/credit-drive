import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {AdditionalExpense} from '../domain/model/additional-expense.entity';
import {AdditionalExpenseResource, AdditionalExpensesResponse} from './additional-expenses-response';
import {AdditionalExpenseAssembler} from './additional-expense-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAdditionalExpensesEndpointPath}`;

export class AdditionalExpensesApiEndpoint
  extends BaseApiEndpoint<AdditionalExpense, AdditionalExpenseResource, AdditionalExpensesResponse, AdditionalExpenseAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new AdditionalExpenseAssembler());
  }
}
