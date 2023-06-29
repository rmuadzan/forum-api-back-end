const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async isCommentLiked(commet_id, user_id) {
    const query = {
      text: 'SELECT 1 FROM thread_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commet_id, user_id],
    };

    const { rowCount } = await this._pool.query(query);

    return rowCount > 0;
  }

  async addCommentLike(comment_id, user_id) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, comment_id, user_id],
    };

    await this._pool.query(query);
  }

  async deleteCommentLike(comment_id, user_id) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [comment_id, user_id],
    };

    await this._pool.query(query);
  }

  async getCommentLikeCount(comment_id) {
    const query = {
      text: 'SELECT COUNT(*) FROM thread_comment_likes WHERE comment_id = $1',
      values: [comment_id],
    };

    const results = await this._pool.query(query);

    return parseInt(results.rows[0].count, 10);
  }
}

module.exports = CommentLikeRepositoryPostgres;
