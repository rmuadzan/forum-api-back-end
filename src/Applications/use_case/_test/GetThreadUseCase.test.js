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
      created_at: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });

    const mockDetailComment = new DetailThreadComment({
      id: 'comment-123',
      content: 'This is a comment',
      created_at: '2022-08-08T07:19:09.775Z',
      username: 'dicoding',
      is_deleted: false,
    });

    const mockDetailCommentReply = new DetailThreadComment({
      id: 'reply-123',
      content: 'This is a reply',
      created_at: '2022-08-08T07:19:09.775Z',
      username: 'dicoding',
      is_deleted: false,
    });

    const mockThreadRepository = {};
    const mockThreadCommentRepository = {};
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve);
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockThreadCommentRepository.getAllThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve([mockDetailComment]));
    mockThreadCommentRepository.getAllCommentReplies = jest.fn()
      .mockImplementation(() => Promise.resolve([mockDetailCommentReply]));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository, threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute('thread-123');

    // Assert
    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'A Thread',
      body: 'This is a thread',
      created_at: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });
    const expectedComment = new DetailThreadComment({
      id: 'comment-123',
      content: 'This is a comment',
      created_at: '2022-08-08T07:19:09.775Z',
      username: 'dicoding',
      is_deleted: false,
    });
    const expectedReply = new DetailThreadComment({
      id: 'reply-123',
      content: 'This is a reply',
      created_at: '2022-08-08T07:19:09.775Z',
      username: 'dicoding',
      is_deleted: false,
    });
    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: [
        {
          ...expectedComment,
          replies: [
            expectedReply,
          ],
        },
      ],
    });
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith('thread-123');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockThreadCommentRepository.getAllThreadComments).toBeCalledWith('thread-123');
    expect(mockThreadCommentRepository.getAllCommentReplies).toBeCalledWith('comment-123');
  });
});
