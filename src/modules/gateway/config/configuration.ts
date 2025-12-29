export type TConfiguration = {
  AUTH_TRANSPORT_PORT: number;
  USERS_TRANSPORT_PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
};

export default (): TConfiguration => {
  const authTransportPort = process.env.AUTH_TRANSPORT_PORT;
  if (!authTransportPort) {
    throw new Error('AUTH_TRANSPORT_PORT is not set');
  }

  const usersTransportPort = process.env.USERS_TRANSPORT_PORT;
  if (!usersTransportPort) {
    throw new Error('USERS_TRANSPORT_PORT is not set');
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set');
  }

  return {
    AUTH_TRANSPORT_PORT: parseInt(authTransportPort, 10),
    USERS_TRANSPORT_PORT: parseInt(usersTransportPort, 10),
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  };
};
