const NewThreadComment = require('../../Domains/thread_comments/entities/NewThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({
    user_id, thread_id, parent_id, useCasePayload,
  }) {
    await this._threadRepository.checkAvailabilityThread(thread_id);
    if (parent_id) {
      await this._threadCommentRepository.checkAvailabilityComment(parent_id, thread_id);
    }

    const payload = {
      ...useCasePayload,
      user_id,
      thread_id,
      parent_id,
      type: parent_id ? 'reply' : 'comment',
    };
    const newThreadComment = new NewThreadComment(payload);
    return this._threadCommentRepository.addComment(newThreadComment);
  }
}

module.exports = AddThreadCommentUseCase;
