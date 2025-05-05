import { createClient } from 'contentful';

// Initialize the Contentful client with credentials from environment variables
const client = createClient({
  space: process.env.VUE_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN,
});

// Export the initialized client for use in other parts of the application
export default client; 