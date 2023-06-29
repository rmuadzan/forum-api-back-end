class DeleteThreadCommentUseCase {
  constructor({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({
    id, user_id, thread_id, parent_id,
  }) {
    await this._threadRepository.checkAvailabilityThread(thread_id);
    if (parent_id) {
      await this._threadCommentRepository.checkAvailabilityComment(parent_id, thread_id);
      await this._threadCommentRepository.checkAvailabilityCommentReply(id, thread_id, parent_id);
    } else {
      await this._threadCommentRepository.checkAvailabilityComment(id, thread_id);
    }
    await this._threadCommentRepository.verifyCommentOwner(id, user_id);

    await this._threadCommentRepository.deleteComment(id);
  }
}

module.exports = DeleteThreadCommentUseCase;
