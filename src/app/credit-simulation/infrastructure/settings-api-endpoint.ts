import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Setting} from '../domain/model/setting.entity';
import {SettingResource, SettingsResponse} from './settings-response';
import {SettingAssembler} from './setting-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSettingsEndpointPath}`;

export class SettingsApiEndpoint
  extends BaseApiEndpoint<Setting, SettingResource, SettingsResponse, SettingAssembler> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new SettingAssembler());
  }
}
