import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon('postgresql://expenseDB_owner:POaNAiyF5U7n@ep-damp-wind-a5v2owpx.us-east-2.aws.neon.tech/expenseDB?sslmode=require');
// const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
export const db = drizzle(sql, {schema}); 


