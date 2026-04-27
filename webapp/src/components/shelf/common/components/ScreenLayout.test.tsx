import { render, screen } from '@testing-library/react';
import { ScreenLayout } from './';

describe('ScreenLayout', () => {
  it('renders without an outer paper wrapper or header', () => {
    const { container } = render(
      <ScreenLayout sidebar={<div>Sidebar panel</div>}>
        <div>Main workspace</div>
      </ScreenLayout>
    );

    expect(screen.getByTestId('screen-layout-root')).toBeInTheDocument();
    expect(screen.queryByTestId('screen-layout-header')).toBeNull();
    expect(container.querySelector('.MuiPaper-root')).toBeNull();
  });

  it('stacks the sidebar underneath the main content area without default spacing', () => {
    render(
      <ScreenLayout sidebar={<div>Sidebar panel</div>}>
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

  it('forwards sx to the outer container', () => {
    render(
      <ScreenLayout sx={{ margin: 2, padding: 0 }} sidebar={<div>Sidebar panel</div>}>
        <div>Main workspace</div>
      </ScreenLayout>
    );

    const root = screen.getByTestId('screen-layout-root');

    expect(window.getComputedStyle(root).marginTop).toBe('16px');
  });
});
