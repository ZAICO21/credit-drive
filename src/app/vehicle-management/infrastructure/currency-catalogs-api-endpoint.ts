import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {CurrencyCatalog} from '../domain/model/currency-catalog.entity';
import {CurrencyCatalogResource, CurrencyCatalogsResponse} from './currency-catalogs-response';
import {CurrencyCatalogAssembler} from './currency-catalog-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCurrencyCatalogsEndpointPath}`;

export class CurrencyCatalogsApiEndpoint
  extends BaseApiEndpoint<CurrencyCatalog, CurrencyCatalogResource, CurrencyCatalogsResponse, CurrencyCatalogAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new CurrencyCatalogAssembler());
  }
}
