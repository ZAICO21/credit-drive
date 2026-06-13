import {BaseApi} from '../../shared/infrastructure/base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Simulation} from '../domain/model/simulation.entity';
import {PaymentScheduleEntry} from '../domain/model/payment-schedule-entry.entity';
import {InsuranceSimulation} from '../domain/model/insurance-simulation.entity';
import {AdditionalExpense} from '../domain/model/additional-expense.entity';
import {SimulationsApiEndpoint} from './simulations-api-endpoint';
import {PaymentScheduleApiEndpoint} from './payment-schedule-api-endpoint';
import {InsuranceSimulationsApiEndpoint} from './insurance-simulations-api-endpoint';
import {AdditionalExpensesApiEndpoint} from './additional-expenses-api-endpoint';
import {InsuranceTypesApiEndpoint} from './insurance-types-api-endpoint';
import {SettingsApiEndpoint} from './settings-api-endpoint';

@Injectable({providedIn: 'root'})
export class CreditSimulationApi extends BaseApi {
  private readonly simulationsEndpoint: SimulationsApiEndpoint;
  private readonly paymentScheduleEndpoint: PaymentScheduleApiEndpoint;
  private readonly insuranceSimulationsEndpoint: InsuranceSimulationsApiEndpoint;
  private readonly additionalExpensesEndpoint: AdditionalExpensesApiEndpoint;
  private readonly insuranceTypesEndpoint: InsuranceTypesApiEndpoint;
  private readonly settingsEndpoint: SettingsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.simulationsEndpoint = new SimulationsApiEndpoint(http);
    this.paymentScheduleEndpoint = new PaymentScheduleApiEndpoint(http);
    this.insuranceSimulationsEndpoint = new InsuranceSimulationsApiEndpoint(http);
    this.additionalExpensesEndpoint = new AdditionalExpensesApiEndpoint(http);
    this.insuranceTypesEndpoint = new InsuranceTypesApiEndpoint(http);
    this.settingsEndpoint = new SettingsApiEndpoint(http);
  }

  // Simulations
  getSimulations() {
    return this.simulationsEndpoint.getAll();
  }

  getSimulationById(id: string) {
    return this.simulationsEndpoint.getById(id);
  }

  createSimulation(simulation: Simulation) {
    return this.simulationsEndpoint.create(simulation);
  }

  deleteSimulation(id: string) {
    return this.simulationsEndpoint.delete(id);
  }

  // Payment schedule
  getPaymentSchedule() {
    return this.paymentScheduleEndpoint.getAll();
  }

  createPaymentScheduleEntry(entry: PaymentScheduleEntry) {
    return this.paymentScheduleEndpoint.create(entry);
  }

  deletePaymentScheduleEntry(id: string) {
    return this.paymentScheduleEndpoint.delete(id);
  }

  // Insurance simulations
  getInsuranceSimulations() {
    return this.insuranceSimulationsEndpoint.getAll();
  }

  createInsuranceSimulation(insuranceSimulation: InsuranceSimulation) {
    return this.insuranceSimulationsEndpoint.create(insuranceSimulation);
  }

  deleteInsuranceSimulation(id: string) {
    return this.insuranceSimulationsEndpoint.delete(id);
  }

  // Additional expenses
  getAdditionalExpenses() {
    return this.additionalExpensesEndpoint.getAll();
  }

  createAdditionalExpense(expense: AdditionalExpense) {
    return this.additionalExpensesEndpoint.create(expense);
  }

  deleteAdditionalExpense(id: string) {
    return this.additionalExpensesEndpoint.delete(id);
  }

  // Insurance types (catalog)
  getInsuranceTypes() {
    return this.insuranceTypesEndpoint.getAll();
  }

  // Settings (per-advisor defaults)
  getSettings() {
    return this.settingsEndpoint.getAll();
  }
}
