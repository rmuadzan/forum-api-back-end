const AddedThread = require('../AddedThread');

describe('AddedThread', () => {
  it('should throw error when payload not contain need property', () => {
    // Arrange
    const payload = {
      title: 'New Thread',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 12345,
      title: 'New Thread',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'New Thread',
      user_id: 'user-123',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.user_id);
  });
});
