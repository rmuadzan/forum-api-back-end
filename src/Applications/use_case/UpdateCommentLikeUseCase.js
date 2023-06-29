class UpdateCommentLikeUseCase {
  constructor({ commentLikeRepository, threadCommentRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute({ comment_id, user_id, thread_id }) {
    await this._threadCommentRepository.checkAvailabilityComment(comment_id, thread_id);

    const isLiked = await this._commentLikeRepository.isCommentLiked(comment_id, user_id);

    if (isLiked) {
      await this._commentLikeRepository.deleteCommentLike(comment_id, user_id);
    } else {
      await this._commentLikeRepository.addCommentLike(comment_id, user_id);
    }
  }
}

module.exports = UpdateCommentLikeUseCase;
