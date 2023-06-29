class GetThreadUseCase {
  constructor({ threadRepository, threadCommentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(thread_id) {
    await this._threadRepository.checkAvailabilityThread(thread_id);
    const thread = await this._threadRepository.getThreadById(thread_id);
    const threadComments = await this._threadCommentRepository.getAllThreadComments(thread_id);
    const comments = [];

    await (async () => {
      await Promise.all((
        threadComments.map(async (comment) => {
          const likeCount = await this._commentLikeRepository.getCommentLikeCount(comment.id);
          const replies = await this._threadCommentRepository.getAllCommentReplies(comment.id);
          comments.push({ ...comment, likeCount, replies });
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
