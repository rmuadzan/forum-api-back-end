const DetailThreadComment = require('../DetailThreadComment');

describe('DetailThreadComment', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      created_at: new Date('2021-08-08'),
      content: 'This is a comment',
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      created_at: new Date('2021-08-08'),
      content: 'This is a comment',
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new DetailThreadComment(payload)).toThrowError('DETAIL_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThreadComment entity with active comment correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      created_at: new Date('2021-08-08'),
      content: 'This is a comment',
      is_deleted: false,
    };

    // Action
    const detailThreadComment = new DetailThreadComment(payload);

    // Assert
    expect(detailThreadComment).toBeInstanceOf(DetailThreadComment);
    expect(detailThreadComment.id).toEqual(payload.id);
    expect(detailThreadComment.username).toEqual(payload.username);
    expect(detailThreadComment.date).toEqual(payload.created_at);
    expect(detailThreadComment.content).toEqual(payload.content);
  });

  it('should create DetailThreadComment entity with deleted comment correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      created_at: new Date('2021-08-08'),
      content: 'This is a comment',
      is_deleted: true,
    };

    // Action
    const detailThreadComment = new DetailThreadComment(payload);

    // Assert
    expect(detailThreadComment).toBeInstanceOf(DetailThreadComment);
    expect(detailThreadComment.id).toEqual(payload.id);
    expect(detailThreadComment.username).toEqual(payload.username);
    expect(detailThreadComment.date).toEqual(payload.created_at);
    expect(detailThreadComment.content).toEqual('**komentar telah dihapus**');
  });

  it('should create DetailThreadComment entity with active reply correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      created_at: new Date('2021-08-08'),
      content: 'This is a comment',
      is_deleted: false,
      parent_id: 'comment-234',
    };

    // Action
    const detailThreadComment = new DetailThreadComment(payload);

    // Assert
    expect(detailThreadComment).toBeInstanceOf(DetailThreadComment);
    expect(detailThreadComment.id).toEqual(payload.id);
    expect(detailThreadComment.username).toEqual(payload.username);
    expect(detailThreadComment.date).toEqual(payload.created_at);
    expect(detailThreadComment.content).toEqual(payload.content);
  });

  it('should create DetailThreadComment entity with deleted reply correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      created_at: new Date('2021-08-08'),
      content: 'This is a comment',
      is_deleted: true,
      parent_id: 'comment-234',
    };

    // Action
    const detailThreadComment = new DetailThreadComment(payload);

    // Assert
    expect(detailThreadComment).toBeInstanceOf(DetailThreadComment);
    expect(detailThreadComment.id).toEqual(payload.id);
    expect(detailThreadComment.username).toEqual(payload.username);
    expect(detailThreadComment.date).toEqual(payload.created_at);
    expect(detailThreadComment.content).toEqual('**balasan telah dihapus**');
  });
});
