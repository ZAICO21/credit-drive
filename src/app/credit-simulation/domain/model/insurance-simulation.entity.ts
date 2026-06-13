import {BaseEntity} from '../../../shared/domain/model/base-entity';

export interface InsuranceSimulationProps {
  id: string;
  simulationId: string;
  insuranceTypeId: string;
  monthlyRate: number;
  baseCalculo: string;
  applies: boolean;
}

/** Snapshot of an insurance (e.g. Desgravamen, VSVI) applied to a simulation. */
export class InsuranceSimulation implements BaseEntity {
  private readonly _id: string;
  private readonly _simulationId: string;
  private readonly _insuranceTypeId: string;
  private readonly _monthlyRate: number;
  private readonly _baseCalculo: string;
  private readonly _applies: boolean;

  constructor(props: InsuranceSimulationProps) {
    this._id = props.id;
    this._simulationId = props.simulationId;
    this._insuranceTypeId = props.insuranceTypeId;
    this._monthlyRate = props.monthlyRate;
    this._baseCalculo = props.baseCalculo;
    this._applies = props.applies;
  }

  get id(): string {
    return this._id;
  }

  get simulationId(): string {
    return this._simulationId;
  }

  get insuranceTypeId(): string {
    return this._insuranceTypeId;
  }

  get monthlyRate(): number {
    return this._monthlyRate;
  }

  get baseCalculo(): string {
    return this._baseCalculo;
  }

  get applies(): boolean {
    return this._applies;
  }
}
