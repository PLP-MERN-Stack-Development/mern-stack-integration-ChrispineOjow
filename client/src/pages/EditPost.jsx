import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import { usePosts } from '../context/PostContext';
import PostForm from '../components/PostForm';
import Loading from '../components/Loading';
import Error from '../components/Error';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePost, fetchCategories, categories } = usePosts();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSubmit = async (formData) => {
    try {
      await updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={fetchPost} />;
  }

  if (!post) {
    return <Error message="Post not found" />;
  }

  return (
    <div className="edit-post">
      <h1>Edit Post</h1>
      <PostForm
        onSubmit={handleSubmit}
        initialData={post}
        categories={categories}
        fetchCategories={fetchCategories}
      />
    </div>
  );
};

export default EditPost;

