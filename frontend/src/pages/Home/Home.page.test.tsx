import { screen } from '@testing-library/react';

import { renderWithProviders } from '#shared/testing/renderWithProviders';

import HomePage from './Home.page';

// mock the ckeditor lib: replaced by #shared/ckeditor/__mocks__/ckeditor.ts
jest.mock('#shared/ckeditor/CustomEditor.ts');

describe('Home page', () => {
  it('should render correctly', async () => {
    renderWithProviders(<HomePage />, '/');

    await screen.findByText('Nantral Platform');
    expect(screen).toMatchSnapshot();
  });
});
