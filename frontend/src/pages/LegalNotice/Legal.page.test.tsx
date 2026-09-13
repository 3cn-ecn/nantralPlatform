import { screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import { renderWithProviders } from '#shared/testing/renderWithProviders';

import LegalNoticePage from './Legal.page';

// mock the ckeditor lib: replaced by #shared/ckeditor/__mocks__/ckeditor.ts
vi.mock('#shared/ckeditor/CustomEditor.ts');

describe('Home page', () => {
  it('should render correctly', async () => {
    const [component, queryClient] = renderWithProviders(<LegalNoticePage />);

    await screen.findByText('Legal Notice');

    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    expect(component.asFragment()).toMatchSnapshot();
  });
});
