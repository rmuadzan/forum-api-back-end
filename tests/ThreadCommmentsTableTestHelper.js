/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addComment({
    id = 'thread-123',
    user_id = 'user-123',
    thread_id = 'thread-123',
    content = 'This is new comment',
    is_deleted = false,
    created_at = new Date(),
    parent_id,
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, user_id, thread_id, content, is_deleted, created_at, parent_id],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
