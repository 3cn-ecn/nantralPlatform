import { screen } from '@testing-library/react';

import { renderWithProviders } from '#shared/testing/renderWithProviders';

import LegalNoticePage from './Legal.page';

// mock the ckeditor lib: replaced by #shared/ckeditor/__mocks__/ckeditor.ts
jest.mock('#shared/ckeditor/CustomEditor.ts');

describe('Home page', () => {
  it('should render correctly', async () => {
    const component = renderWithProviders(<LegalNoticePage />);

    await screen.findByText('Legal Notice');
    expect(component.asFragment()).toMatchSnapshot();
  });
});
