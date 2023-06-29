/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async addLike(id, comment_id, user_id) {
    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, comment_id, user_id],
    };

    const results = await pool.query(query);
    return results.rows;
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM thread_comment_likes WHERE id = $1',
      values: [id],
    };

    const results = await pool.query(query);
    return results.rows;
  },

  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE 1 = 1',
    };

    await pool.query(query);
  },
};

module.exports = CommentLikesTableTestHelper;
