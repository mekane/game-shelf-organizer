import { Box, Paper, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

interface ScreenLayoutProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  subtitle: string;
  sidebar: ReactNode;
  headerSupplement?: ReactNode;
}

export function ScreenLayout({
  children,
  eyebrow,
  title,
  subtitle,
  sidebar,
  headerSupplement,
}: ScreenLayoutProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid rgba(94, 73, 55, 0.18)',
        background:
          'linear-gradient(145deg, rgba(252,249,243,0.98), rgba(246,239,228,0.96))',
        overflow: 'hidden',
      }}
    >
      <Stack spacing={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          data-testid="screen-layout-header"
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: '0.18em',
                color: 'secondary.main',
                fontWeight: 700,
              }}
            >
              {eyebrow}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              {title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: 820 }}>
              {subtitle}
            </Typography>
          </Box>

          {headerSupplement ? (
            <Box
              data-testid="screen-layout-header-supplement"
              sx={{
                width: { xs: '100%', md: 'auto' },
                flexShrink: 0,
              }}
            >
              {headerSupplement}
            </Box>
          ) : null}
        </Stack>

        <Stack
          data-testid="screen-layout-panels"
          spacing={3}
          sx={{ alignItems: 'stretch' }}
        >
          <Box data-testid="screen-layout-main" sx={{ width: '100%', minWidth: 0 }}>
            {children}
          </Box>
          <Box data-testid="screen-layout-sidebar" sx={{ width: '100%', minWidth: 0 }}>
            {sidebar}
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
