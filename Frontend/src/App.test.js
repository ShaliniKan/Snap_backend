import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the storefront shell', () => {
  render(<App />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  expect(screen.getByText(/my cart/i)).toBeInTheDocument();
});
