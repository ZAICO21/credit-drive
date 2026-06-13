import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {GraceType, RateType} from './credit-simulation.types';

export interface SettingProps {
  id: string;
  userId: string;
  defaultCurrencyCatalogId: string;
  defaultInterestType: RateType;
  defaultGracePeriod: GraceType;
  defaultOpportunityTea: number;
  defaultChangeUsdPen: number;
}

/** Per-advisor default values used to pre-fill the simulation form. */
export class Setting implements BaseEntity {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _defaultCurrencyCatalogId: string;
  private readonly _defaultInterestType: RateType;
  private readonly _defaultGracePeriod: GraceType;
  private readonly _defaultOpportunityTea: number;
  private readonly _defaultChangeUsdPen: number;

  constructor(props: SettingProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._defaultCurrencyCatalogId = props.defaultCurrencyCatalogId;
    this._defaultInterestType = props.defaultInterestType;
    this._defaultGracePeriod = props.defaultGracePeriod;
    this._defaultOpportunityTea = props.defaultOpportunityTea;
    this._defaultChangeUsdPen = props.defaultChangeUsdPen;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get defaultCurrencyCatalogId(): string {
    return this._defaultCurrencyCatalogId;
  }

  get defaultInterestType(): RateType {
    return this._defaultInterestType;
  }

  get defaultGracePeriod(): GraceType {
    return this._defaultGracePeriod;
  }

  get defaultOpportunityTea(): number {
    return this._defaultOpportunityTea;
  }

  get defaultChangeUsdPen(): number {
    return this._defaultChangeUsdPen;
  }
}
