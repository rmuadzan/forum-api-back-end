const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread({ user_id, title, body }) {
    const id = `thread-${this._idGenerator()}`;
    const created_at = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, user_id',
      values: [id, user_id, title, body, created_at],
    };

    const results = await this._pool.query(query);

    return new AddedThread({ ...results.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.*, users.username
             FROM threads
             JOIN users ON users.id = threads.user_id
             WHERE threads.id = $1`,
      values: [id],
    };

    const results = await this._pool.query(query);

    return new DetailThread({ ...results.rows[0] });
  }

  async checkAvailabilityThread(id) {
    const query = {
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [id],
    };

    const results = await this._pool.query(query);

    if (!results.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
