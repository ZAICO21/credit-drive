/**
 * Production environment configuration.
 *
 * @remarks
 * For this academic project the backend is a local json-server mock, so the API
 * base URL is the same in both environments. Each collection in `server/db.json`
 * has its own endpoint path so endpoint clients can compose their full URL as
 * `${platformProviderApiBaseUrl}${platformProvider<Resource>EndpointPath}`.
 */
export const environment = {
  production: true,
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
