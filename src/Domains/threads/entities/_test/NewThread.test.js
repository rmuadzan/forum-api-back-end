const NewThread = require('../NewThread');

describe('NewThread', () => {
  it('should throw error when payload not contain need property', () => {
    // Arrange
    const payload = {
      title: 'New Thread',
      body: 'This is new thread',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      user_id: 'user-fsdngbfsvacs',
      title: 123,
      body: 'This is new thread',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entity correctly', () => {
    // Arrange
    const payload = {
      user_id: 'user-rtyjhkjmghfng',
      title: 'New Thread',
      body: 'This is new thread',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.user_id).toEqual(payload.user_id);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
