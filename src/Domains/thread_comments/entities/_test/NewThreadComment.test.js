const NewThreadComment = require('../NewThreadComment');

describe('NewThreadComment', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      user_id: 'user-123',
      content: 'This is comment',
      type: 'comment',
    };

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      user_id: 123,
      thread_id: 'thread-123',
      content: ['This is comment'],
      type: 'comment',
    };

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadComment without parent_id entity correctly', () => {
    // Arrange
    const payload = {
      user_id: 'user-123',
      thread_id: 'thread-123',
      content: 'This is comment',
      type: 'comment',
    };

    // Action
    const newThreadComment = new NewThreadComment(payload);

    // Assert
    expect(newThreadComment).toBeInstanceOf(NewThreadComment);
    expect(newThreadComment.user_id).toEqual(payload.user_id);
    expect(newThreadComment.thread_id).toEqual(payload.thread_id);
    expect(newThreadComment.content).toEqual(payload.content);
    expect(newThreadComment.parent_id).toEqual(undefined);
    expect(newThreadComment.type).toEqual(payload.type);
  });

  it('should create NewThreadComment with parent_id entity correctly', () => {
    // Arrange
    const payload = {
      user_id: 'user-123',
      thread_id: 'thread-123',
      content: 'This is comment',
      parent_id: 'comment-123',
      type: 'comment',
    };

    // Action
    const newThreadComment = new NewThreadComment(payload);

    // Assert
    expect(newThreadComment).toBeInstanceOf(NewThreadComment);
    expect(newThreadComment.user_id).toEqual(payload.user_id);
    expect(newThreadComment.thread_id).toEqual(payload.thread_id);
    expect(newThreadComment.content).toEqual(payload.content);
    expect(newThreadComment.parent_id).toEqual(payload.parent_id);
    expect(newThreadComment.type).toEqual(payload.type);
  });
});
