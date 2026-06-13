import {BaseEntity} from '../../../shared/domain/model/base-entity';

export type AdditionalExpenseType = 'UNICO' | 'PERIODICO';

export interface AdditionalExpenseProps {
  id: string;
  simulationId: string;
  concept: string;
  type: AdditionalExpenseType;
  amount: number;
  installmentStart: number;
  installmentEnd: number;
  description: string;
}

/** A one-time (UNICO) or recurring (PERIODICO) extra cost attached to a simulation. */
export class AdditionalExpense implements BaseEntity {
  private readonly _id: string;
  private readonly _simulationId: string;
  private readonly _concept: string;
  private readonly _type: AdditionalExpenseType;
  private readonly _amount: number;
  private readonly _installmentStart: number;
  private readonly _installmentEnd: number;
  private readonly _description: string;

  constructor(props: AdditionalExpenseProps) {
    this._id = props.id;
    this._simulationId = props.simulationId;
    this._concept = props.concept;
    this._type = props.type;
    this._amount = props.amount;
    this._installmentStart = props.installmentStart;
    this._installmentEnd = props.installmentEnd;
    this._description = props.description;
  }

  get id(): string {
    return this._id;
  }

  get simulationId(): string {
    return this._simulationId;
  }

  get concept(): string {
    return this._concept;
  }

  get type(): AdditionalExpenseType {
    return this._type;
  }

  get amount(): number {
    return this._amount;
  }

  get installmentStart(): number {
    return this._installmentStart;
  }

  get installmentEnd(): number {
    return this._installmentEnd;
  }

  get description(): string {
    return this._description;
  }

  /** Whether this expense applies to the given installment number (1-based). */
  appliesToInstallment(installmentNumber: number): boolean {
    return installmentNumber >= this._installmentStart && installmentNumber <= this._installmentEnd;
  }
}
