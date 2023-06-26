const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        user_id: 'user-123',
        title: 'New Thread',
        body: 'This is new thread',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'New Thread',
        user_id: 'user-123',
      }));
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw error when thread is not available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(threadRepository.checkAvailabilityThread('thread-123')).rejects.toThrow(NotFoundError);
    });

    it('should not throw error when thread is available', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action and Assert
      await expect(threadRepository.checkAvailabilityThread('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should get the correct thread', async () => {
      // Arrange
      const date = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        user_id: 'user-123',
        title: 'A Thread',
        body: 'This is a thread',
        created_at: date,
      });

      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepository.getThreadById('thread-123');

      // Assert
      expect(thread).toStrictEqual(new DetailThread({
        id: 'thread-123',
        title: 'A Thread',
        body: 'This is a thread',
        created_at: date,
        username: 'dicoding',
      }));
    });
  });
});
