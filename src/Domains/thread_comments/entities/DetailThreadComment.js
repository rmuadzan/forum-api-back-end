/* eslint-disable class-methods-use-this */

class DetailThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.created_at;
    this.content = this._setContent(payload);
  }

  _verifyPayload({
    id, username, created_at, content, is_deleted,
  }) {
    if (!id || !username || !created_at || !content || is_deleted === undefined) {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string'
        || !(created_at instanceof Date) || typeof content !== 'string' || typeof is_deleted !== 'boolean') {
      throw new Error('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _setContent({ content, is_deleted, parent_id }) {
    if (parent_id) {
      if (is_deleted) return '**balasan telah dihapus**';
    }
    if (is_deleted) return '**komentar telah dihapus**';
    return content;
  }
}

module.exports = DetailThreadComment;
