import { useNavigate } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import PostForm from '../components/PostForm';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost, fetchCategories, categories } = usePosts();

  const handleSubmit = async (formData) => {
    try {
      await createPost(formData);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="create-post">
      <h1>Create New Post</h1>
      <PostForm
        onSubmit={handleSubmit}
        categories={categories}
        fetchCategories={fetchCategories}
      />
    </div>
  );
};

export default CreatePost;

