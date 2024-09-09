import PropTypes from 'prop-types';

const ErrorPage = ({ onRetry }) => {
  return (
    <div className="error-page">
      <h1>An Error Occurred</h1>
      <p>There was an error fetching the data. Please refresh the page and try again.</p>
      <button onClick={onRetry}>Refresh</button>
    </div>
  );
};

ErrorPage.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default ErrorPage;