const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const user_id = 'user-123';
    const useCasePayload = {
      title: 'New Thread',
      body: 'This is new thread',
    };
    const mockAddedThread = new AddedThread({
      id: 'thread-efgdbfbfe',
      title: useCasePayload.title,
      user_id,
    });

    const mockThreadRepository = {};
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

    // Action
    const addedThread = await addThreadUseCase.execute(user_id, useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-efgdbfbfe',
      title: useCasePayload.title,
      user_id,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      user_id,
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
