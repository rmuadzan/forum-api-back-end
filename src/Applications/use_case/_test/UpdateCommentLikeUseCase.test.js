const UpdateCommentLikeUseCase = require('../UpdateCommentLikeUseCase');

describe('UpdateCommentLikeUseCase', () => {
  it('should orchesrating the like comment action properly', async () => {
    // Arrange
    const mockCommentLikeRepository = {};
    const mockThreadCommentRepository = {};
    mockThreadCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLiked = jest.fn(() => Promise.resolve(false));
    mockCommentLikeRepository.addCommentLike = jest.fn(() => Promise.resolve());

    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await updateCommentLikeUseCase.execute({
      comment_id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123',
    });

    // Assert
    expect(mockThreadCommentRepository.checkAvailabilityComment).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentLikeRepository.isCommentLiked).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith('comment-123', 'user-123');
  });

  it('should orchesrating the unlike comment action properly', async () => {
    // Arrange
    const mockCommentLikeRepository = {};
    const mockThreadCommentRepository = {};
    mockThreadCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLiked = jest.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteCommentLike = jest.fn(() => Promise.resolve());

    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await updateCommentLikeUseCase.execute({
      comment_id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123',
    });

    // Assert
    expect(mockThreadCommentRepository.checkAvailabilityComment).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentLikeRepository.isCommentLiked).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentLikeRepository.deleteCommentLike).toBeCalledWith('comment-123', 'user-123');
  });
});
