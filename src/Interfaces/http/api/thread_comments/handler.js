const autoBind = require('auto-bind');
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');
const UpdateCommentLikeUseCase = require('../../../../Applications/use_case/UpdateCommentLikeUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadCommentHandler(request, h) {
    const { id: user_id } = request.auth.credentials;
    const { threadId } = request.params;

    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const addedComment = await addThreadCommentUseCase.execute({
      user_id, thread_id: threadId, useCasePayload: request.payload,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request) {
    const { id: user_id } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
    await deleteThreadCommentUseCase.execute({
      id: commentId,
      user_id,
      thread_id: threadId,
    });

    return {
      status: 'success',
    };
  }

  async postCommentReplyHandler(request, h) {
    const { id: user_id } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);
    const addedReply = await addThreadCommentUseCase.execute({
      user_id, thread_id: threadId, parent_id: commentId, useCasePayload: request.payload,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentReplyHandler(request) {
    const { id: user_id } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);
    await deleteThreadCommentUseCase.execute({
      id: replyId,
      user_id,
      thread_id: threadId,
      parent_id: commentId,
    });

    return {
      status: 'success',
    };
  }

  async putCommentLikeHandler(request) {
    const { id: user_id } = request.auth.credentials;
    const { commentId: comment_id, threadId: thread_id } = request.params;

    const updateCommentLikeUseCase = this._container.getInstance(UpdateCommentLikeUseCase.name);

    await updateCommentLikeUseCase.execute({ comment_id, user_id, thread_id });

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadCommentsHandler;
