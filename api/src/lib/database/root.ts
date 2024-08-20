


export const createRootUser = async () => {
  await db.user.create({
    data: {
      sub: 'dabih:root',
      name: 'Root',
      email: '
    },
  });

};
