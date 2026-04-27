import { Box, ButtonBase, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { Size2D } from '../../common/types';

interface LayoutHeaderProps {
  name: string;
  size: Size2D;
  resetSignal: number;
  onConfirmName: (nextName: string) => void;
  onConfirmSize: (nextSize: Size2D) => void;
}

export function LayoutHeader({
  name,
  size,
  resetSignal,
  onConfirmName,
  onConfirmSize,
}: LayoutHeaderProps) {
  const [draftName, setDraftName] = useState(name);
  const [draftWidth, setDraftWidth] = useState(String(size.width));
  const [draftHeight, setDraftHeight] = useState(String(size.height));
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSize, setIsEditingSize] = useState(false);

  useEffect(() => {
    setDraftName(name);
    setIsEditingName(false);
  }, [name]);

  useEffect(() => {
    setDraftWidth(String(size.width));
    setDraftHeight(String(size.height));
    setIsEditingSize(false);
  }, [size.height, size.width]);

  useEffect(() => {
    setDraftName(name);
    setDraftWidth(String(size.width));
    setDraftHeight(String(size.height));
    setIsEditingName(false);
    setIsEditingSize(false);
  }, [name, resetSignal, size.height, size.width]);

  const parsedDraftSize = useMemo(
    () => parseDraftSize(draftWidth, draftHeight),
    [draftHeight, draftWidth]
  );

  function cancelHeaderEdits() {
    setDraftName(name);
    setDraftWidth(String(size.width));
    setDraftHeight(String(size.height));
    setIsEditingName(false);
    setIsEditingSize(false);
  }

  function handleStartEditingName() {
    setDraftName(name);
    setIsEditingSize(false);
    setIsEditingName(true);
  }

  function handleCancelEditingName() {
    setDraftName(name);
    setIsEditingName(false);
  }

  function handleConfirmEditingName() {
    if (draftName !== name) {
      onConfirmName(draftName);
    }

    setIsEditingName(false);
  }

  function handleNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleConfirmEditingName();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEditingName();
    }
  }

  function handleStartEditingSize() {
    setDraftWidth(String(size.width));
    setDraftHeight(String(size.height));
    setIsEditingName(false);
    setIsEditingSize(true);
  }

  function handleCancelEditingSize() {
    setDraftWidth(String(size.width));
    setDraftHeight(String(size.height));
    setIsEditingSize(false);
  }

  function handleConfirmEditingSize() {
    if (!parsedDraftSize) {
      return;
    }

    if (
      parsedDraftSize.width !== size.width ||
      parsedDraftSize.height !== size.height
    ) {
      onConfirmSize(parsedDraftSize);
    }

    setIsEditingSize(false);
  }

  function handleSizeKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleConfirmEditingSize();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEditingSize();
    }
  }

  function handleHeaderClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!isEditingName && !isEditingSize) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest('[data-layout-header-editor="true"]')) {
      return;
    }

    cancelHeaderEdits();
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Stack
      data-testid="layout-header"
      direction={{ xs: 'column', sm: 'row' }}
      onClickCapture={handleHeaderClickCapture}
      spacing={1.5}
      sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}
    >
      <Box sx={{ minWidth: 0, flex: { xs: '1 1 auto', sm: '0 1 auto' } }}>
        {isEditingName ? (
          <Stack
            data-layout-header-editor="true"
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            sx={{ width: '100%', alignItems: { xs: 'stretch', md: 'center' } }}
          >
            <TextField
              autoFocus
              data-testid="layout-name-field"
              size="small"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={handleNameKeyDown}
              slotProps={{ htmlInput: { 'aria-label': 'Layout Name' } }}
              sx={(theme) => ({
                minWidth: { xs: '100%', md: 320 },
                '& .MuiOutlinedInput-root': {
                  minHeight: 'unset',
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.88)',
                  color: 'rgba(59, 39, 24, 0.94)',
                  fontSize: theme.typography.h5.fontSize,
                  fontWeight: 700,
                  lineHeight: theme.typography.h5.lineHeight,
                  letterSpacing: theme.typography.h5.letterSpacing,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '0.75px',
                    borderColor: 'rgba(88, 64, 42, 0.22)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '0.75px',
                    borderColor: 'rgba(88, 64, 42, 0.32)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '0.75px',
                    borderColor: 'rgba(130, 89, 57, 0.52)',
                  },
                },
                '& .MuiInputBase-input': {
                  px: 1,
                  py: 0.5,
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  lineHeight: 'inherit',
                  letterSpacing: 'inherit',
                },
              })}
            />
            <HeaderActionButtons
              cancelAriaLabel="Cancel layout name edit"
              cancelTestId="layout-name-cancel"
              confirmAriaLabel="Confirm layout name"
              confirmTestId="layout-name-confirm"
              onCancel={handleCancelEditingName}
              onConfirm={handleConfirmEditingName}
            />
          </Stack>
        ) : (
          <ButtonBase
            aria-label={`Edit layout name ${name}`}
            data-testid="layout-name-trigger"
            onClick={handleStartEditingName}
            sx={{
              borderRadius: 2,
              px: 1,
              py: '5px',
              justifyContent: 'flex-start',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: 'rgba(77, 53, 36, 0.06)',
              },
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              data-testid="layout-name-heading"
              sx={{
                fontWeight: 700,
                color: 'rgba(59, 39, 24, 0.94)',
              }}
            >
              {name}
            </Typography>
          </ButtonBase>
        )}
      </Box>

      <Box
        aria-hidden="true"
        data-testid="layout-header-spacer"
        sx={{
          flex: { xs: '0 0 0px', sm: '1 1 auto' },
          minWidth: { xs: 0, sm: 24 },
          minHeight: 1,
          alignSelf: 'stretch',
          cursor: isEditingName || isEditingSize ? 'pointer' : 'default',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flex: '0 0 auto',
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {isEditingSize ? (
          <Stack
            data-layout-header-editor="true"
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            sx={{
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'flex-end',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'rgba(95, 72, 50, 0.72)',
                  }}
                >
                  W
                </Typography>
                <TextField
                  autoFocus
                  data-testid="layout-size-width-field"
                  type="number"
                  size="small"
                  value={draftWidth}
                  onChange={(event) => setDraftWidth(event.target.value)}
                  onKeyDown={handleSizeKeyDown}
                  slotProps={{
                    htmlInput: {
                      'aria-label': 'Workspace Width',
                      min: 1,
                      step: 1,
                    },
                  }}
                  sx={{
                    ...compactNumericFieldSx,
                    width: 92,
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: 'rgba(95, 72, 50, 0.72)',
                  }}
                >
                  H
                </Typography>
                <TextField
                  data-testid="layout-size-height-field"
                  type="number"
                  size="small"
                  value={draftHeight}
                  onChange={(event) => setDraftHeight(event.target.value)}
                  onKeyDown={handleSizeKeyDown}
                  slotProps={{
                    htmlInput: {
                      'aria-label': 'Workspace Height',
                      min: 1,
                      step: 1,
                    },
                  }}
                  sx={{
                    ...compactNumericFieldSx,
                    width: 92,
                  }}
                />
              </Stack>
            </Stack>
            <HeaderActionButtons
              cancelAriaLabel="Cancel workspace size edit"
              cancelTestId="layout-size-cancel"
              confirmAriaLabel="Confirm workspace size"
              confirmDisabled={!parsedDraftSize}
              confirmTestId="layout-size-confirm"
              onCancel={handleCancelEditingSize}
              onConfirm={handleConfirmEditingSize}
            />
          </Stack>
        ) : (
          <ButtonBase
            aria-label={`Edit workspace size ${size.width} by ${size.height}`}
            data-testid="layout-size-trigger"
            onClick={handleStartEditingSize}
            sx={{
              borderRadius: 999,
              px: 1.25,
              py: 0.75,
              justifyContent: 'flex-end',
              textAlign: 'right',
              '&:hover': {
                backgroundColor: 'rgba(77, 53, 36, 0.06)',
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <HeaderSizeValue
                label="W"
                testId="layout-size-width-value"
                value={size.width}
              />
              <HeaderSizeValue
                label="H"
                testId="layout-size-height-value"
                value={size.height}
              />
            </Stack>
          </ButtonBase>
        )}
      </Box>
    </Stack>
  );
}

function HeaderActionButtons({
  cancelAriaLabel,
  cancelTestId,
  confirmAriaLabel,
  confirmDisabled = false,
  confirmTestId,
  onCancel,
  onConfirm,
}: {
  cancelAriaLabel: string;
  cancelTestId: string;
  confirmAriaLabel: string;
  confirmDisabled?: boolean;
  confirmTestId: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        alignSelf: { xs: 'flex-end', md: 'center' },
      }}
    >
      <IconButton
        aria-label={cancelAriaLabel}
        data-testid={cancelTestId}
        size="small"
        onClick={onCancel}
        sx={headerCancelButtonSx}
      >
        <Box
          component="svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          sx={headerCancelIconSx}
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </Box>
      </IconButton>
      <IconButton
        aria-label={confirmAriaLabel}
        data-testid={confirmTestId}
        size="small"
        color="secondary"
        disabled={confirmDisabled}
        onClick={onConfirm}
        sx={headerConfirmButtonSx}
      >
        <Box
          component="svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          sx={headerConfirmIconSx}
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Box>
      </IconButton>
    </Stack>
  );
}

function HeaderSizeValue({
  label,
  testId,
  value,
}: {
  label: string;
  testId: string;
  value: number;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        alignItems: 'baseline',
        color: 'rgba(59, 39, 24, 0.94)',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'rgba(95, 72, 50, 0.72)',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle1"
        data-testid={testId}
        sx={{
          fontWeight: 700,
          color: 'inherit',
        }}
      >
        {formatDimension(value)}
      </Typography>
    </Stack>
  );
}

function parseDraftSize(width: string, height: string): Size2D | null {
  const nextWidth = parseDimension(width);
  const nextHeight = parseDimension(height);

  if (nextWidth === null || nextHeight === null) {
    return null;
  }

  return {
    width: nextWidth,
    height: nextHeight,
  };
}

function parseDimension(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const nextValue = Number.parseFloat(value);

  if (!Number.isFinite(nextValue)) {
    return null;
  }

  return Math.max(1, Math.round(nextValue));
}

function formatDimension(value: number): string {
  return `${value}"`;
}

const compactNumericFieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 'unset',
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.88)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderWidth: '0.75px',
      borderColor: 'rgba(88, 64, 42, 0.22)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderWidth: '0.75px',
      borderColor: 'rgba(88, 64, 42, 0.32)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '0.75px',
      borderColor: 'rgba(130, 89, 57, 0.52)',
    },
  },
  '& .MuiInputBase-input': {
    px: 1,
    py: 0.5,
    fontWeight: 700,
    textAlign: 'right',
    color: 'rgba(59, 39, 24, 0.94)',
  },
} as const;

const headerCancelButtonSx = {
  width: 40,
  height: 40,
  border: '1px solid rgba(88, 64, 42, 0.16)',
  backgroundColor: 'rgba(255,255,255,0.72)',
  color: 'rgba(77, 53, 36, 0.8)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
} as const;

const headerConfirmButtonSx = {
  width: 40,
  height: 40,
  border: '1px solid rgba(88, 64, 42, 0.18)',
  backgroundColor: 'rgba(130, 89, 57, 0.12)',
  color: 'rgba(77, 53, 36, 0.96)',
  '&:hover': {
    backgroundColor: 'rgba(130, 89, 57, 0.18)',
  },
  '&.Mui-disabled': {
    borderColor: 'rgba(88, 64, 42, 0.14)',
    backgroundColor: 'rgba(130, 89, 57, 0.06)',
    color: 'rgba(77, 53, 36, 0.38)',
  },
} as const;

const headerCancelIconSx = {
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const headerConfirmIconSx = {
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;
