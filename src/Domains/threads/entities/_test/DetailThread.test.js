const DetailThread = require('../DetailThread');

describe('DetailThread', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'A Thread',
      body: 'This is a thread',
      created_at: new Date('2021-08-08'),
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A Thread',
      body: 'This is a thread',
      created_at: new Date('2021-08-08'),
      username: ['dicoding'],
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'A Thread',
      body: 'This is a thread',
      created_at: new Date('2021-08-08'),
      username: 'dicoding',
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.created_at);
    expect(detailThread.username).toEqual(payload.username);
  });
});
