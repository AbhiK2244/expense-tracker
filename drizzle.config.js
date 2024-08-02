export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://expenseDB_owner:POaNAiyF5U7n@ep-damp-wind-a5v2owpx.us-east-2.aws.neon.tech/expenseDB?sslmode=require',
      // url: process.env.NEXT_PUBLIC_DATABASE_URL,
    }
  };