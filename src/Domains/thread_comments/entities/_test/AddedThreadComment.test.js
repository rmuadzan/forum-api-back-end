const AddedThreadComment = require('../AddedThreadComment');

describe('AddedThreadComment', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'This is comment',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'This is comment',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThreadComment entity correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'This is comment',
      user_id: 'user-123',
    };

    // Action
    const addedThreadComment = new AddedThreadComment(payload);

    // Assert
    expect(addedThreadComment).toBeInstanceOf(AddedThreadComment);
    expect(addedThreadComment.id).toEqual(payload.id);
    expect(addedThreadComment.content).toEqual(payload.content);
    expect(addedThreadComment.owner).toEqual(payload.user_id);
  });
});
