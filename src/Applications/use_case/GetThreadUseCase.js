class GetThreadUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(thread_id) {
    await this._threadRepository.checkAvailabilityThread(thread_id);
    const thread = await this._threadRepository.getThreadById(thread_id);
    const threadComments = await this._threadCommentRepository.getAllThreadComments(thread_id);
    const comments = [];

    await (async () => {
      await Promise.all((
        threadComments.map(async (comment) => {
          const replies = await this._threadCommentRepository.getAllCommentReplies(comment.id);
          comments.push({ ...comment, replies });
        })
      ));
    })();

    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetThreadUseCase;
