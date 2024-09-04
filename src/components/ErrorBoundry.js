// ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here if needed
    console.error('Error caught in Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can customize the fallback UI as needed
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <p>Please try again later or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
