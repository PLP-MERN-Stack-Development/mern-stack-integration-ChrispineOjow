import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="post-card">
      {post.featuredImage && (
        <div className="post-card-image">
          <img
            src={`http://localhost:5000/uploads/${post.featuredImage}`}
            alt={post.title}
          />
        </div>
      )}
      <div className="post-card-content">
        <div className="post-card-meta">
          <span className="post-card-category">{post.category?.name}</span>
          <span className="post-card-date">{formatDate(post.createdAt)}</span>
        </div>
        <h2 className="post-card-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className="post-card-excerpt">{post.excerpt}</p>
        )}
        <div className="post-card-footer">
          <span className="post-card-author">By {post.author?.name}</span>
          <span className="post-card-views">{post.viewCount} views</span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;

