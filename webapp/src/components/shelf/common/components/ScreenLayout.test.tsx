import { render, screen } from '@testing-library/react';
import { ScreenLayout } from './';

describe('ScreenLayout', () => {
  it('stacks the sidebar underneath the main content area', () => {
    render(
      <ScreenLayout
        eyebrow="Layout"
        title="Workspace"
        subtitle="Shared panel layout."
        sidebar={<div>Sidebar panel</div>}
      >
        <div>Main workspace</div>
      </ScreenLayout>
    );

    const panels = screen.getByTestId('screen-layout-panels');
    const main = screen.getByTestId('screen-layout-main');
    const sidebar = screen.getByTestId('screen-layout-sidebar');

    expect(panels).toHaveStyle({ flexDirection: 'column' });
    expect(panels.firstElementChild).toBe(main);
    expect(panels.lastElementChild).toBe(sidebar);
    expect(main).toHaveStyle({ width: '100%' });
    expect(sidebar).toHaveStyle({ width: '100%' });
  });

  it('renders optional header supplement content alongside the header copy', () => {
    render(
      <ScreenLayout
        eyebrow="Layout"
        title="Workspace"
        subtitle="Shared panel layout."
        headerSupplement={<div>Header supplement</div>}
        sidebar={<div>Sidebar panel</div>}
      >
        <div>Main workspace</div>
      </ScreenLayout>
    );

    expect(screen.getByTestId('screen-layout-header')).toBeInTheDocument();
    expect(screen.getByTestId('screen-layout-header-supplement')).toHaveTextContent(
      'Header supplement'
    );
  });
});
