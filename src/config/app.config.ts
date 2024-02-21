export default (): any => ({
  port: parseInt(process.env.PORT) || 5000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  secret_key: process.env.SECRET_KEY || 'SECRET_KEY',
  expired_token: process.env.EXPIRED_TOKEN || '1h',
});
