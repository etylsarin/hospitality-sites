import { parse } from 'pg-connection-string';

const { host, port, database, user, password } = parse(
  process.env.DATABASE_URL
);
export default () => ({
  connection: {  
    client: 'postgres',
    connection: {
      host,
      port,
      database,
      user,
      password,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    debug: false,
  },
});