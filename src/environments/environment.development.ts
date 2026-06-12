/**
 * Development environment configuration.
 *
 * @remarks
 * Replaces `environment.ts` during `ng serve` (see angular.json fileReplacements).
 * Points at the local json-server mock backend.
 */
export const environment = {
  production: false,
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1',

  // IAM
  platformProviderUsersEndpointPath: '/users',
  platformProviderRolesEndpointPath: '/roles',

  // Client Management
  platformProviderClientsEndpointPath: '/clients',

  // Vehicle Management
  platformProviderVehiclesEndpointPath: '/vehicles',
  platformProviderVehicleImagesEndpointPath: '/vehicle_images',

  // Catalogs / configuration
  platformProviderCurrencyCatalogsEndpointPath: '/currency_catalogs',
  platformProviderInsuranceTypesEndpointPath: '/insurance_types',
  platformProviderSettingsEndpointPath: '/settings',

  // Credit Simulation (core)
  platformProviderSimulationsEndpointPath: '/simulations',
  platformProviderInsuranceSimulationsEndpointPath: '/insurance_simulations',
  platformProviderAdditionalExpensesEndpointPath: '/additional_expenses',
  platformProviderPaymentScheduleEndpointPath: '/payment_schedule',
  platformProviderReportsEndpointPath: '/reports'
};
