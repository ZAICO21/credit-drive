import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {AdditionalExpense, AdditionalExpenseType} from '../domain/model/additional-expense.entity';
import {AdditionalExpenseResource, AdditionalExpensesResponse} from './additional-expenses-response';

export class AdditionalExpenseAssembler
  implements BaseAssembler<AdditionalExpense, AdditionalExpenseResource, AdditionalExpensesResponse> {
  toEntityFromResource(resource: AdditionalExpenseResource): AdditionalExpense {
    return new AdditionalExpense({
      id: resource.id,
      simulationId: resource.simulation_id,
      concept: resource.concept,
      type: resource.type as AdditionalExpenseType,
      amount: resource.amount,
      installmentStart: resource.installment_start,
      installmentEnd: resource.installment_end,
      description: resource.description
    });
  }

  toResourceFromEntity(entity: AdditionalExpense): AdditionalExpenseResource {
    return {
      id: entity.id,
      simulation_id: entity.simulationId,
      concept: entity.concept,
      type: entity.type,
      amount: entity.amount,
      installment_start: entity.installmentStart,
      installment_end: entity.installmentEnd,
      description: entity.description
    };
  }

  toEntitiesFromResponse(response: AdditionalExpensesResponse): AdditionalExpense[] {
    return response.additional_expenses.map(resource => this.toEntityFromResource(resource));
  }
}
