/* eslint-disable class-methods-use-this */

class NewThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.user_id = payload.user_id;
    this.thread_id = payload.thread_id;
    this.content = payload.content;
    this.parent_id = payload.parent_id;
    this.type = payload.type;
  }

  _verifyPayload({
    user_id, thread_id, content, type,
  }) {
    if (!user_id || !thread_id || !content || !type) {
      throw new Error('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof user_id !== 'string' || typeof thread_id !== 'string'
        || typeof content !== 'string' || typeof type !== 'string') {
      throw new Error('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThreadComment;
