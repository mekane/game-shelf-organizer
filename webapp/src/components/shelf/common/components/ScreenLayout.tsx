import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { PropsWithChildren, ReactNode } from 'react';

interface ScreenLayoutProps extends PropsWithChildren {
  sidebar: ReactNode;
  sx?: SxProps<Theme>;
}

export function ScreenLayout({ children, sidebar, sx }: ScreenLayoutProps) {
  return (
    <Box data-testid="screen-layout-root" sx={sx}>
      <Stack data-testid="screen-layout-panels" sx={{ alignItems: 'stretch' }}>
        <Box data-testid="screen-layout-main" sx={{ width: '100%', minWidth: 0 }}>
          {children}
        </Box>
        <Box data-testid="screen-layout-sidebar" sx={{ width: '100%', minWidth: 0 }}>
          {sidebar}
        </Box>
      </Stack>
    </Box>
  );
}
