/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

class CommentLikeRepository {
  async isCommentLiked(comment_id, user_id) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addCommentLike(comment_id, user_id) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentLike(comment_id, user_id) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentLikeCount(comment_id) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
module.exports = CommentLikeRepository;
