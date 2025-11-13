import './CommentsList.css';

const CommentsList = ({ comments }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="comments-empty">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="comments-list">
      {comments.map((comment, index) => (
        <div key={index} className="comment-item">
          <div className="comment-header">
            <strong className="comment-author">
              {comment.user?.name || 'Anonymous'}
            </strong>
            <span className="comment-date">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;

