/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServersTestHelper = {
  async getAccessToken({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
  }) {
    await UsersTableTestHelper.addUser({
      id, username, password, fullname,
    });
    return Jwt.token.generate({ id, username }, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServersTestHelper;
