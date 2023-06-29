const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(user_id, useCasePayload) {
    const payload = {
      ...useCasePayload,
      user_id,
    };

    const newThread = new NewThread(payload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
