export type TConfiguration = {
  USERS_TRANSPORT_PORT: number;
};

export default (): TConfiguration => {
  const usersTransportPort = process.env.USERS_TRANSPORT_PORT;
  if (!usersTransportPort) {
    throw new Error('USERS_TRANSPORT_PORT is not set');
  }

  return {
    USERS_TRANSPORT_PORT: parseInt(usersTransportPort, 10),
  };
};
