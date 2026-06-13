import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {GraceType, RateType} from '../domain/model/credit-simulation.types';
import {Setting} from '../domain/model/setting.entity';
import {SettingResource, SettingsResponse} from './settings-response';

export class SettingAssembler implements BaseAssembler<Setting, SettingResource, SettingsResponse> {
  toEntityFromResource(resource: SettingResource): Setting {
    return new Setting({
      id: resource.id,
      userId: resource.user_id,
      defaultCurrencyCatalogId: resource.default_currency_catalog_id,
      defaultInterestType: resource.default_interest_type as RateType,
      defaultGracePeriod: resource.default_grace_period as GraceType,
      defaultOpportunityTea: resource.default_opportunity_tea,
      defaultChangeUsdPen: resource.default_change_usd_pen
    });
  }

  toResourceFromEntity(entity: Setting): SettingResource {
    return {
      id: entity.id,
      user_id: entity.userId,
      default_currency_catalog_id: entity.defaultCurrencyCatalogId,
      default_interest_type: entity.defaultInterestType,
      default_grace_period: entity.defaultGracePeriod,
      default_opportunity_tea: entity.defaultOpportunityTea,
      default_change_usd_pen: entity.defaultChangeUsdPen
    };
  }

  toEntitiesFromResponse(response: SettingsResponse): Setting[] {
    return response.settings.map(resource => this.toEntityFromResource(resource));
  }
}
