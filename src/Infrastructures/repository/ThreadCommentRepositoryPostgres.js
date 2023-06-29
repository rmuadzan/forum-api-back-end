const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const AddedThreadComment = require('../../Domains/thread_comments/entities/AddedThreadComment');
const DetailThreadComment = require('../../Domains/thread_comments/entities/DetailThreadComment');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment({
    user_id, thread_id, parent_id, content, type,
  }) {
    const id = `${type}-${this._idGenerator()}`;
    const is_deleted = false;
    const created_at = new Date();

    const query = {
      text: 'INSERT INTO thread_comments VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, user_id',
      values: [id, user_id, thread_id, content, is_deleted, created_at, parent_id],
    };

    const result = await this._pool.query(query);

    return new AddedThreadComment({ ...result.rows[0] });
  }

  async getAllThreadComments(thread_id) {
    const query = {
      text: `SELECT thread_comments.*, users.username
             FROM thread_comments
             LEFT JOIN users on users.id = thread_comments.user_id
             WHERE thread_id = $1 AND parent_id IS NULL
             ORDER BY thread_comments.created_at`,
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new DetailThreadComment({ ...row }));
  }

  async getAllCommentReplies(parent_id) {
    const query = {
      text: `SELECT thread_comments.*, users.username
             FROM thread_comments
             LEFT JOIN users on users.id = thread_comments.user_id
             WHERE parent_id = $1
             ORDER BY thread_comments.created_at`,
      values: [parent_id],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => new DetailThreadComment({ ...row }));
  }

  async checkAvailabilityComment(id, thread_id) {
    const query = {
      text: 'SELECT 1 FROM thread_comments WHERE id = $1 AND thread_id = $2',
      values: [id, thread_id],
    };

    const results = await this._pool.query(query);

    if (!results.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async checkAvailabilityCommentReply(id, thread_id, parent_id) {
    const query = {
      text: 'SELECT 1 FROM thread_comments WHERE id = $1 AND thread_id = $2 AND parent_id = $3',
      values: [id, thread_id, parent_id],
    };

    const results = await this._pool.query(query);

    if (!results.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, user_id) {
    const query = {
      text: 'SELECT user_id FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const results = await this._pool.query(query);

    if (results.rows[0].user_id !== user_id) {
      throw new AuthorizationError('anda tidak berhak mengakses resources ini');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE thread_comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadCommentRepositoryPostgres;
