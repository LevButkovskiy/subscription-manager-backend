export type TConfiguration = {
  AUTH_TRANSPORT_PORT: number;
  USERS_TRANSPORT_PORT: number;
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

  return {
    AUTH_TRANSPORT_PORT: parseInt(authTransportPort, 10),
    USERS_TRANSPORT_PORT: parseInt(usersTransportPort, 10),
  };
};
