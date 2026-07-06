import request from './request';

export const getCommentsByArticleId = (articleId) => request.get(`/comments/${articleId}`);
export const addComment = (data) => request.post('/comments', data);
export const deleteComment = (id) => request.delete(`/comments/${id}`);
