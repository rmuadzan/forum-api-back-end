const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommmentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThreadComment = require('../../../Domains/thread_comments/entities/AddedThreadComment');
const DetailThreadComment = require('../../../Domains/thread_comments/entities/DetailThreadComment');
const NewThreadComment = require('../../../Domains/thread_comments/entities/NewThreadComment');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

describe('ThreadCommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new thread comment and return added thread comment correctly', async () => {
      // Arrange
      const newThreadComment = new NewThreadComment({
        user_id: 'user-123',
        thread_id: 'thread-123',
        content: 'This is comment',
        type: 'comment',
      });
      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadCommentRepository.addComment(newThreadComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedThreadComment({
        id: 'comment-123',
        content: 'This is comment',
        user_id: 'user-123',
      }));
      const comments = await ThreadCommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].user_id).toEqual('user-123');
      expect(comments[0].thread_id).toEqual('thread-123');
      expect(comments[0].content).toEqual('This is comment');
      expect(comments[0].is_deleted).toEqual(false);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundRrror when comment is not available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepository.checkAvailabilityComment('comment-123', 'thread-123')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment is available', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepository.checkAvailabilityComment('comment-123', 'thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('checkAvailabilityCommentReply function', () => {
    it('should throw NotFoundRrror when reply is not available', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepository.checkAvailabilityCommentReply('reply-123', 'thread-123', 'comment-123')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when reply is available', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123',
      });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'reply-123', user_id: 'user-123', thread_id: 'thread-123', parent_id: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepository.checkAvailabilityCommentReply('reply-123', 'thread-123', 'comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not the owner of the comment', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepository.verifyCommentOwner('comment-123', 'user-234'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is the owner of the comment', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(threadCommentRepository.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123', content: 'This is comment',
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepository.deleteComment('comment-123');

      // Assert
      const comments = await ThreadCommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].user_id).toEqual('user-123');
      expect(comments[0].thread_id).toEqual('thread-123');
      expect(comments[0].content).toEqual('This is comment');
      expect(comments[0].is_deleted).toEqual(true);
    });
  });

  describe('getAllThreadComments function', () => {
    it('should get all thread comments correctly', async () => {
      // Arrange
      const date1 = new Date('2021-08-08').toISOString();
      const date2 = new Date('2022-08-08').toISOString();
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        user_id: 'user-123',
        thread_id: 'thread-123',
        content: 'comment 1',
        created_at: date1,
      });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-234',
        user_id: 'user-123',
        thread_id: 'thread-123',
        content: 'comment 2',
        is_deleted: true,
        created_at: date2,
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await threadCommentRepository.getAllThreadComments('thread-123');

      // Arrange
      expect(comments).toHaveLength(2);
      expect(comments).toStrictEqual([
        new DetailThreadComment({
          id: 'comment-123',
          username: 'dicoding',
          created_at: date1,
          content: 'comment 1',
          is_deleted: false,
        }),
        new DetailThreadComment({
          id: 'comment-234',
          username: 'dicoding',
          created_at: date2,
          content: 'comment 2',
          is_deleted: true,
        }),
      ]);
    });
  });

  describe('getAllCommentReplies function', () => {
    it('should get all thread comments correctly', async () => {
      // Arrange
      const date1 = new Date('2021-08-08').toISOString();
      const date2 = new Date('2022-08-08').toISOString();
      const date3 = new Date('2022-10-08').toISOString();
      await ThreadCommentsTableTestHelper.addComment({
        id: 'comment-123',
        user_id: 'user-123',
        thread_id: 'thread-123',
        content: 'comment 1',
        created_at: date1,
      });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'reply-123',
        user_id: 'user-123',
        thread_id: 'thread-123',
        content: 'reply 1',
        created_at: date2,
        parent_id: 'comment-123',
      });
      await ThreadCommentsTableTestHelper.addComment({
        id: 'reply-234',
        user_id: 'user-123',
        thread_id: 'thread-123',
        content: 'reply 2',
        created_at: date3,
        is_deleted: true,
        parent_id: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const threadCommentRepository = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const replies = await threadCommentRepository.getAllCommentReplies('comment-123');

      // Arrange
      expect(replies).toHaveLength(2);
      expect(replies).toStrictEqual([
        new DetailThreadComment({
          id: 'reply-123',
          username: 'dicoding',
          created_at: date2,
          content: 'reply 1',
          is_deleted: false,
          parent_id: 'comment-123',
        }),
        new DetailThreadComment({
          id: 'reply-234',
          username: 'dicoding',
          created_at: date3,
          content: 'reply 2',
          is_deleted: true,
          parent_id: 'comment-123',
        }),
      ]);
    });
  });
});
