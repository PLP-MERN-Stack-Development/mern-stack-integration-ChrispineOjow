import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import Loading from '../components/Loading';
import Error from '../components/Error';
import CommentForm from '../components/CommentForm';
import CommentsList from '../components/CommentsList';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getPost(id);
      setPost(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setCommentLoading(true);
    try {
      const response = await postService.addComment(id, { content });
      setPost(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !post) {
    return <Error message={error} onRetry={fetchPost} />;
  }

  if (!post) {
    return <Error message="Post not found" />;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canEdit = isAuthenticated && (user?.id === post.author?._id || user?.role === 'admin');

  return (
    <article className="post-detail">
      {post.featuredImage && (
        <div className="post-detail-image">
          <img
            src={`http://localhost:5000/uploads/${post.featuredImage}`}
            alt={post.title}
          />
        </div>
      )}

      <div className="post-detail-content">
        <div className="post-detail-header">
          <div className="post-detail-meta">
            <span className="post-detail-category">{post.category?.name}</span>
            <span className="post-detail-date">{formatDate(post.createdAt)}</span>
            <span className="post-detail-views">{post.viewCount} views</span>
          </div>
          {canEdit && (
            <div className="post-detail-actions">
              <Link to={`/posts/${id}/edit`} className="btn btn-edit">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-delete">
                Delete
              </button>
            </div>
          )}
        </div>

        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-author">
          By <strong>{post.author?.name}</strong>
        </div>

        <div
          className="post-detail-body"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="post-detail-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-detail-comments">
          <h2>Comments ({post.comments?.length || 0})</h2>
          <CommentsList comments={post.comments || []} />
          {isAuthenticated ? (
            <CommentForm onSubmit={handleAddComment} loading={commentLoading} />
          ) : (
            <div className="comment-login-prompt">
              <Link to="/login">Login</Link> to add a comment
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostDetail;

