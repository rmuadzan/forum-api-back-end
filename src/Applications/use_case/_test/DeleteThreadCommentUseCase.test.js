const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestrating the delete thread comment action properly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      user_id: 'user-123',
      thread_id: 'thread-123',
    };

    const mockThreadCommentRepository = {};
    const mockThreadRepository = {};
    mockThreadCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.thread_id);
    expect(mockThreadCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.id, useCasePayload.thread_id);
    expect(mockThreadCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.id, useCasePayload.user_id);
    expect(mockThreadCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.id);
  });

  it('should orchestrating the delete thread comment action properly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      user_id: 'user-123',
      thread_id: 'thread-123',
      parent_id: 'comment-123',
    };

    const mockThreadCommentRepository = {};
    const mockThreadRepository = {};
    mockThreadCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.checkAvailabilityCommentReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.thread_id);
    expect(mockThreadCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.parent_id, useCasePayload.thread_id);
    expect(mockThreadCommentRepository.checkAvailabilityCommentReply)
      .toHaveBeenCalledWith(useCasePayload.id, useCasePayload.thread_id, useCasePayload.parent_id);
    expect(mockThreadCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.id, useCasePayload.user_id);
    expect(mockThreadCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.id);
  });
});
