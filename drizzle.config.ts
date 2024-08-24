import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/tursodb/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: 'file:mypaperwork.db',
    // url: process.env.TURSO_CONNECTION_URL!,
    // authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
