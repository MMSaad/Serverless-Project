// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'e2mg7iqieb'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-tk2m75mz.auth0.com',            // Auth0 domain
  clientId: '0Z4ZocBelgfq4S85jyOJTxVv10h1wmr1',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
