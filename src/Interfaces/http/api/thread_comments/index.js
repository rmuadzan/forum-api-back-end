const ThreadCommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'thread_comments',
  register: async (server, { container }) => {
    const handler = new ThreadCommentsHandler(container);
    server.route(routes(handler));
  },
};
