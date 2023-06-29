/* eslint-disable class-methods-use-this */

class AddedThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.user_id;
  }

  _verifyPayload({ id, content, user_id }) {
    if (!id || !content || !user_id) {
      throw new Error('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof user_id !== 'string') {
      throw new Error('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThreadComment;
