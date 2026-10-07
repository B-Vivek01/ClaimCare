import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.error('ClaimCare page failed', error); }
  render() {
    if (this.state.failed) return <main role="alert" style={{ padding: '4rem', textAlign: 'center' }}><h1>This page could not load</h1><p>Please reload the application and try again.</p><button onClick={() => window.location.reload()}>Reload</button><p><a href="/">Return home</a></p></main>;
    return this.props.children;
  }
}
