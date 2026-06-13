import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {CapitalizationType, GraceType, RateType} from '../domain/model/credit-simulation.types';
import {CurrencyCode, Simulation} from '../domain/model/simulation.entity';
import {SimulationResource, SimulationsResponse} from './simulations-response';

export class SimulationAssembler implements BaseAssembler<Simulation, SimulationResource, SimulationsResponse> {
  toEntityFromResource(resource: SimulationResource): Simulation {
    return new Simulation({
      id: resource.id,
      clientId: resource.client_id,
      vehicleId: resource.vehicle_id,
      userId: resource.user_id,
      vehiclePrice: resource.vehicle_price,
      currency: resource.currency as CurrencyCode,
      initialFeePercentage: resource.initial_fee_percentage,
      initialFeeAmount: resource.initial_fee_amount,
      financedAmount: resource.financed_amount,
      termMonths: resource.term_months,
      futureValuePercentage: resource.future_value_percentage,
      futureValueAmount: resource.future_value_amount,
      rateType: resource.rate_type as RateType,
      interestRate: resource.interest_rate,
      capitalization: resource.capitalization as CapitalizationType | null,
      monthlyEffectiveRate: resource.monthly_effective_rate,
      graceType: resource.grace_type as GraceType,
      gracePeriod: resource.grace_period,
      portes: resource.portes,
      baseQuota: resource.cuota_base ?? 0,
      tcea: resource.tcea,
      van: resource.van,
      tir: resource.tir,
      disbursementDate: resource.disbursement_date,
      registrationDate: resource.registration_date
    });
  }

  toResourceFromEntity(entity: Simulation): SimulationResource {
    return {
      id: entity.id,
      client_id: entity.clientId,
      vehicle_id: entity.vehicleId,
      user_id: entity.userId,
      vehicle_price: entity.vehiclePrice,
      currency: entity.currency,
      initial_fee_percentage: entity.initialFeePercentage,
      initial_fee_amount: entity.initialFeeAmount,
      financed_amount: entity.financedAmount,
      term_months: entity.termMonths,
      future_value_percentage: entity.futureValuePercentage,
      future_value_amount: entity.futureValueAmount,
      rate_type: entity.rateType,
      interest_rate: entity.interestRate,
      capitalization: entity.capitalization,
      monthly_effective_rate: entity.monthlyEffectiveRate,
      grace_type: entity.graceType,
      grace_period: entity.gracePeriod,
      portes: entity.portes,
      cuota_base: entity.baseQuota,
      tcea: entity.tcea,
      van: entity.van,
      tir: entity.tir,
      disbursement_date: entity.disbursementDate,
      registration_date: entity.registrationDate
    };
  }

  toEntitiesFromResponse(response: SimulationsResponse): Simulation[] {
    return response.simulations.map(resource => this.toEntityFromResource(resource));
  }
}
