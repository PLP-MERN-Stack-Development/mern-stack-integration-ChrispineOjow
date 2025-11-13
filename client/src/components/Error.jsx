import './Error.css';

const Error = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <p className="error-message">{message || 'An error occurred'}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;

