const ServersTestHelper = require('../../../../tests/ServersTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommmentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  let accessToken;

  beforeEach(async () => {
    accessToken = await ServersTestHelper.getAccessToken({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 401 when request authorization header is not exist', async () => {
      // Arrange
      const requestPayload = {
        title: 'New Thread',
        body: 'This is new thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'This is new thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: true,
        body: 'This is new thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'New Thread',
        body: 'This is new thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when request authorization header is not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is new comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';

      const requestPayload = {
        content: 'This is new comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const thread_id = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const thread_id = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });
      const requestPayload = {
        content: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const thread_id = 'thread-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });

      const requestPayload = {
        content: 'This is new comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when request authorization header is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 403 when user delete comment that is belong to other', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: thread_id, user_id: 'user-234' });
      await ThreadCommentsTableTestHelper.addComment({
        id: comment_id, user_id: 'user-234', thread_id,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resources ini');
    });

    it('should response 200 and return data correctly', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id, user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: comment_id, user_id: 'user-123', thread_id,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and give the correct data', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const date1 = new Date('2021-08-08').toISOString();
      const date2 = (new Date('2022-08-08')).toISOString();
      await ThreadsTableTestHelper.addThread({ id: thread_id, user_id: 'user-123' });
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

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${thread_id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeInstanceOf(Object);
      expect(responseJson.data).toHaveProperty('thread');
      expect(responseJson.data.thread).toBeInstanceOf(Object);
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(2);
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when request authorization header is not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is new comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';

      const requestPayload = {
        content: 'This is new comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });

      const requestPayload = {
        content: 'This is new comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });
      await ThreadCommentsTableTestHelper.addComment({ id: comment_id, thread_id });
      const requestPayload = {};

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });
      await ThreadCommentsTableTestHelper.addComment({ id: comment_id, thread_id });
      const requestPayload = {
        content: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted comment reply', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });
      await ThreadCommentsTableTestHelper.addComment({ id: comment_id, thread_id });

      const requestPayload = {
        content: 'This is new comment',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${thread_id}/comments/${comment_id}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 when request authorization header is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      const reply_id = 'reply-123';

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/${reply_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      const reply_id = 'reply-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/${reply_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 404 when comment reply is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      const reply_id = 'reply-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });
      await ThreadCommentsTableTestHelper.addComment({
        id: comment_id, user_id: 'user-123', thread_id,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/${reply_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply tidak ditemukan');
    });

    it('should response 403 when user delete comment reply that is belong to other', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      const reply_id = 'reply-123';
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'user' });
      await ThreadsTableTestHelper.addThread({ id: thread_id, user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: comment_id, user_id: 'user-123', thread_id,
      });
      await ThreadCommentsTableTestHelper.addComment({
        id: reply_id, user_id: 'user-234', thread_id, parent_id: comment_id,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/${reply_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resources ini');
    });

    it('should response 200 and return data correctly', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      const reply_id = 'reply-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id, user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: comment_id, user_id: 'user-123', thread_id,
      });
      await ThreadCommentsTableTestHelper.addComment({
        id: reply_id, user_id: 'user-123', thread_id, parent_id: comment_id,
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread_id}/comments/${comment_id}/replies/${reply_id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when request authorization header is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when comment is not exist', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${thread_id}/comments/${comment_id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 200 and return data correctly', async () => {
      // Arrange
      const thread_id = 'thread-123';
      const comment_id = 'comment-123';
      await ThreadsTableTestHelper.addThread({ id: thread_id, user_id: 'user-123' });
      await ThreadCommentsTableTestHelper.addComment({
        id: comment_id, user_id: 'user-123', thread_id,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${thread_id}/comments/${comment_id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
