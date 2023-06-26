const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');
const NewThreadComment = require('../../../Domains/thread_comments/entities/NewThreadComment');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add thread comment action properly', async () => {
    // Arrange
    const user_id = 'user-123';
    const thread_id = 'thread-123';
    const useCasePayload = {
      content: 'This is comment',
    };

    const mockAddedThreadComment = new AddedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      user_id,
    });

    const mockThreadCommentRepository = {};
    const mockThreadRepository = {};
    mockThreadCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThreadComment));
    mockThreadCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addThreadCommentUseCase = new AddThreadCommentUseCase(
      {
        threadCommentRepository: mockThreadCommentRepository,
        threadRepository: mockThreadRepository,
      },
    );

    // Action
    const addedComment = await addThreadCommentUseCase.execute({
      user_id, thread_id, useCasePayload,
    });

    // Assert
    expect(addedComment).toStrictEqual(new AddedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      user_id,
    }));
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(thread_id);
    expect(mockThreadCommentRepository.checkAvailabilityComment).not.toHaveBeenCalled();
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(new NewThreadComment({
      user_id,
      thread_id,
      content: 'This is comment',
      type: 'comment',
    }));
  });

  it('should orchestrating the add thread comment reply action properly', async () => {
    // Arrange
    const user_id = 'user-123';
    const thread_id = 'thread-123';
    const parent_id = 'comment-123';
    const useCasePayload = {
      content: 'This is reply',
    };

    const mockAddedThreadComment = new AddedThreadComment({
      id: 'reply-123',
      content: useCasePayload.content,
      user_id,
    });

    const mockThreadCommentRepository = {};
    const mockThreadRepository = {};
    mockThreadCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThreadComment));
    mockThreadCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addThreadCommentUseCase = new AddThreadCommentUseCase(
      {
        threadCommentRepository: mockThreadCommentRepository,
        threadRepository: mockThreadRepository,
      },
    );

    // Action
    const addedComment = await addThreadCommentUseCase.execute({
      user_id, thread_id, parent_id, useCasePayload,
    });

    // Assert
    expect(addedComment).toStrictEqual(new AddedThreadComment({
      id: 'reply-123',
      content: useCasePayload.content,
      user_id,
    }));
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(thread_id);
    expect(mockThreadCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(parent_id, thread_id);
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(new NewThreadComment({
      user_id,
      thread_id,
      parent_id,
      content: 'This is reply',
      type: 'reply',
    }));
  });
});
