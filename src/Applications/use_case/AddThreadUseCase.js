const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(user_id, useCasePayload) {
    useCasePayload.user_id = user_id;
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
