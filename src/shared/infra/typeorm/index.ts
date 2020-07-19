import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      name,
      port: 5434,
      database:
        process.env.NODE_ENV === 'test'
          ? 'gostack_desafio09_tests'
          : defaultOptions.database,
    }),
  );
};
