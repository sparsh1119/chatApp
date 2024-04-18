import { Client , Databases ,Account  } from 'appwrite';

export const PROJECT_ID = '659eeabad2036a8763f5'
export const DATABASE_ID = '659eec2e9bfb3ce9704a'
export const COLLECTION_ID_MESSAGES = '659eec5038f84e0c3e9a'


const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('659eeabad2036a8763f5');

export const databases = new Databases(client);
export const account = new Account(client);

export default client;