// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  storageUrl: 'https://davidlees.blob.core.windows.net',
  apiUrl: 'https://davidleesapi.azurewebsites.net',
  config: {
    tenant: 'd3349c10-c856-4f37-ab6b-360639105705',
    clientId: 'a1025a19-84f2-471f-826a-eab55f311184',
    endpoints: {
      'https://davidleesapi.azurewebsites.net': 'a1025a19-84f2-471f-826a-eab55f311184',
    },
    cacheLocation: 'sessionStorage',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
