const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommmentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  const fakeIdGenerator = () => '123';
  const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', user_id: 'user-123' });
    await ThreadCommentsTableTestHelper.addComment({ id: 'comment-123', user_id: 'user-123', thread_id: 'thread-123' });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('isCommentLiked function', () => {
    it('should return true when comment is liked', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addLike('like-123', 'comment-123', 'user-123');

      // Action
      const isLiked = await commentLikeRepositoryPostgres.isCommentLiked('comment-123', 'user-123');

      // Assert
      expect(isLiked).toEqual(true);
      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
    });

    it('should return true when comment is liked', async () => {
      // Action
      const isLiked = await commentLikeRepositoryPostgres.isCommentLiked('comment-123', 'user-123');

      // Assert
      expect(isLiked).toEqual(false);
      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('addCommentLike function', () => {
    it('should add comment like to database', async () => {
      // Action
      await commentLikeRepositoryPostgres.addCommentLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteCommentLike function', () => {
    it('should delete comment like to database', async () => {
      // Arrange
      await CommentLikesTableTestHelper.addLike('like-123', 'comment-123', 'user-123');

      // Action
      await commentLikeRepositoryPostgres.deleteCommentLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('getCommentLikeCount function', () => {
    it('should get the total like of comment from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user' });
      await CommentLikesTableTestHelper.addLike('like-123', 'comment-123', 'user-123');
      await CommentLikesTableTestHelper.addLike('like-234', 'comment-123', 'user-234');

      // Action
      const likeCount = await commentLikeRepositoryPostgres.getCommentLikeCount('comment-123');

      // Assert
      expect(likeCount).toEqual(2);
    });
  });
});
