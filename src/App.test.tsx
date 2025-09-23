import React from 'react';
import { render, screen } from '@testing-library/react';
import About from './About';

test('renders about page content', () => {
  render(<About />);
  const aboutHeading = screen.getByRole('heading', { name: /about/i });
  expect(aboutHeading).toBeInTheDocument();
});

// Test basic components without router
test('about page has descriptive text', () => {
  render(<About />);
  const description = screen.getByText(/language playground application/i);
  expect(description).toBeInTheDocument();
});
