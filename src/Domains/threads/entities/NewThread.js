/* eslint-disable class-methods-use-this */

class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.user_id = payload.user_id;
    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload({ user_id, title, body }) {
    if (!user_id || !title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof user_id !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
