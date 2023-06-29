const DetailThreadComment = require('../../../Domains/thread_comments/entities/DetailThreadComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action properly', async () => {
    // Arrange
    const mockDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'A Thread',
      body: 'This is a thread',
      created_at: new Date('2021-08-08'),
      username: 'dicoding',
    });

    const mockDetailComment = new DetailThreadComment({
      id: 'comment-123',
      content: 'This is a comment',
      created_at: new Date('2021-08-10'),
      username: 'dicoding',
      is_deleted: false,
    });

    const mockDetailCommentReply = new DetailThreadComment({
      id: 'reply-123',
      content: 'This is a reply',
      created_at: new Date('2021-08-12'),
      username: 'dicoding',
      is_deleted: false,
    });

    const mockThreadRepository = {};
    const mockThreadCommentRepository = {};
    const mockCommentLikeRepository = {};
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve);
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockThreadCommentRepository.getAllThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve([mockDetailComment]));
    mockCommentLikeRepository.getCommentLikeCount = jest.fn()
      .mockImplementation(() => Promise.resolve(2));
    mockThreadCommentRepository.getAllCommentReplies = jest.fn()
      .mockImplementation(() => Promise.resolve([mockDetailCommentReply]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute('thread-123');

    // Assert
    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'A Thread',
      body: 'This is a thread',
      created_at: new Date('2021-08-08'),
      username: 'dicoding',
    });
    const expectedComment = new DetailThreadComment({
      id: 'comment-123',
      content: 'This is a comment',
      created_at: new Date('2021-08-10'),
      username: 'dicoding',
      is_deleted: false,
    });
    const expectedReply = new DetailThreadComment({
      id: 'reply-123',
      content: 'This is a reply',
      created_at: new Date('2021-08-12'),
      username: 'dicoding',
      is_deleted: false,
    });
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          likeCount: 2,
          replies: [
            expectedReply,
          ],
        },
      ],
    });
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith('thread-123');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockThreadCommentRepository.getAllThreadComments).toBeCalledWith('thread-123');
    expect(mockCommentLikeRepository.getCommentLikeCount).toBeCalledWith('comment-123');
    expect(mockThreadCommentRepository.getAllCommentReplies).toBeCalledWith('comment-123');
  });
});
