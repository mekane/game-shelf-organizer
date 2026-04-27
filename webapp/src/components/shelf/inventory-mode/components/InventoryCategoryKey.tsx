import { Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { alpha, darken, useTheme } from '@mui/material/styles';
import type { Category } from '../../common/types';

interface InventoryCategoryKeyProps {
  categories: Category[];
}

export function InventoryCategoryKey({ categories }: InventoryCategoryKeyProps) {
  const theme = useTheme();

  if (categories.length === 0) {
    return null;
  }

  return (
    <Box
      data-testid="inventory-category-key"
      sx={{
        alignSelf: { xs: 'stretch', md: 'flex-start' },
        ml: { md: 2 },
        minWidth: { xs: '100%', md: 320 },
        maxWidth: { xs: '100%', md: 360 },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 0.75,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'text.secondary',
        }}
      >
        Category Key
      </Typography>

      <Box
        sx={{
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Table
          size="small"
          sx={{
            tableLayout: 'fixed',
            '& th, & td': {
              borderColor: 'divider',
              py: 0.75,
            },
            '& thead th': {
              backgroundColor: 'action.hover',
              color: 'text.secondary',
              fontWeight: 700,
            },
            '& tbody tr:last-of-type td': {
              borderBottom: 0,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell align="right">Color</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                data-testid={`inventory-category-row-${category.id}`}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  {category.name}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    data-testid={`inventory-category-chip-${category.id}`}
                    size="small"
                    label={category.color}
                    sx={{
                      minWidth: 92,
                      justifyContent: 'center',
                      fontWeight: 700,
                      backgroundColor: category.color,
                      color: theme.palette.getContrastText(category.color),
                      border: `1px solid ${alpha(darken(category.color, 0.38), 0.34)}`,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
