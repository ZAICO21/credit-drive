import {BaseEntity} from '../../../shared/domain/model/base-entity';

export interface InsuranceTypeProps {
  id: string;
  name: string;
  description: string;
  baseCalculo: string;
  monthlyRate: number;
  mandatory: boolean;
  status: boolean;
}

/** Catalog entry for an insurance product (e.g. VSVI, Desgravamen) offerable in simulations. */
export class InsuranceType implements BaseEntity {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _description: string;
  private readonly _baseCalculo: string;
  private readonly _monthlyRate: number;
  private readonly _mandatory: boolean;
  private readonly _status: boolean;

  constructor(props: InsuranceTypeProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._baseCalculo = props.baseCalculo;
    this._monthlyRate = props.monthlyRate;
    this._mandatory = props.mandatory;
    this._status = props.status;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get baseCalculo(): string {
    return this._baseCalculo;
  }

  get monthlyRate(): number {
    return this._monthlyRate;
  }

  get mandatory(): boolean {
    return this._mandatory;
  }

  get status(): boolean {
    return this._status;
  }
}
