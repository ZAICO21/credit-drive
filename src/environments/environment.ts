/**
 * Production environment configuration.
 *
 * Uses Supabase Database and Cloudinary.
 */
export const environment = {
  production: true,

  dataProvider: 'supabase' as const,

  /**
   * Fallback JSON Server configuration.
   * Can be removed once all bounded contexts are migrated.
   */
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

  // Credit Simulation
  platformProviderSimulationsEndpointPath: '/simulations',
  platformProviderInsuranceSimulationsEndpointPath: '/insurance_simulations',
  platformProviderAdditionalExpensesEndpointPath: '/additional_expenses',
  platformProviderPaymentScheduleEndpointPath: '/payment_schedule',
  platformProviderReportsEndpointPath: '/reports',

  // Supabase Database
  supabaseUrl: 'https://TU_PROJECT_ID.supabase.co',
  supabasePublishableKey: 'TU_SUPABASE_ANON_OR_PUBLISHABLE_KEY',

  // Cloudinary
  cloudinaryCloudName: 'TU_CLOUDINARY_CLOUD_NAME',
  cloudinaryUploadPreset: 'TU_UNSIGNED_UPLOAD_PRESET',
  cloudinaryFolder: 'credit-drive/vehicles',
};
