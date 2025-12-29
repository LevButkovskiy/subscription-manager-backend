export type TConfiguration = {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_SYNCHRONIZE: boolean;
};

export default (): TConfiguration => {
  const databaseHost = process.env.POSTGRES_HOST;
  if (!databaseHost) {
    throw new Error('POSTGRES_HOST is not set');
  }

  const databasePort = process.env.POSTGRES_PORT;
  if (!databasePort) {
    throw new Error('POSTGRES_PORT is not set');
  }

  const databaseName = process.env.POSTGRES_DB;
  if (!databaseName) {
    throw new Error('POSTGRES_DB is not set');
  }

  const databaseUsername = process.env.POSTGRES_USER;
  if (!databaseUsername) {
    throw new Error('POSTGRES_USER is not set');
  }

  const databasePassword = process.env.POSTGRES_PASSWORD;
  if (!databasePassword) {
    throw new Error('POSTGRES_PASSWORD is not set');
  }

  const databaseSynchronize = process.env.NODE_ENV !== 'production';

  return {
    POSTGRES_HOST: databaseHost,
    POSTGRES_PORT: parseInt(databasePort, 10),
    POSTGRES_DB: databaseName,
    POSTGRES_USER: databaseUsername,
    POSTGRES_PASSWORD: databasePassword,
    POSTGRES_SYNCHRONIZE: databaseSynchronize,
  };
};
