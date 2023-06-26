const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action and Assert
    await expect(threadCommentRepository.addComment({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.getAllThreadComments('')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.checkAvailabilityComment('')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.verifyCommentOwner('', '')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.deleteComment('', '')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
