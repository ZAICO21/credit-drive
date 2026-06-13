import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {PeriodType} from '../domain/model/credit-simulation.types';
import {PaymentScheduleEntry} from '../domain/model/payment-schedule-entry.entity';
import {PaymentScheduleResource, PaymentScheduleResponse} from './payment-schedule-response';

export class PaymentScheduleAssembler
  implements BaseAssembler<PaymentScheduleEntry, PaymentScheduleResource, PaymentScheduleResponse> {
  toEntityFromResource(resource: PaymentScheduleResource): PaymentScheduleEntry {
    return new PaymentScheduleEntry({
      id: resource.id,
      simulationId: resource.simulation_id,
      installmentNumber: resource.installment_number,
      paymentDate: resource.payment_date,
      periodType: resource.period_type as PeriodType,
      initialBalance: resource.initial_balance,
      interest: resource.interest,
      amortization: resource.amortization,
      totalInsurance: resource.total_insurance,
      portes: resource.portes,
      otherExpenses: resource.other_expenses,
      totalPayment: resource.total_payment,
      finalBalance: resource.final_balance,
      cashFlow: resource.cash_flow
    });
  }

  toResourceFromEntity(entity: PaymentScheduleEntry): PaymentScheduleResource {
    return {
      id: entity.id,
      simulation_id: entity.simulationId,
      installment_number: entity.installmentNumber,
      payment_date: entity.paymentDate,
      period_type: entity.periodType,
      initial_balance: entity.initialBalance,
      interest: entity.interest,
      amortization: entity.amortization,
      total_insurance: entity.totalInsurance,
      portes: entity.portes,
      other_expenses: entity.otherExpenses,
      total_payment: entity.totalPayment,
      final_balance: entity.finalBalance,
      cash_flow: entity.cashFlow
    };
  }

  toEntitiesFromResponse(response: PaymentScheduleResponse): PaymentScheduleEntry[] {
    return response.payment_schedule.map(resource => this.toEntityFromResource(resource));
  }
}
