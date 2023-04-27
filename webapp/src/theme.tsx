import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: '#666',
        },
        secondary: {
            main: '#aaa',
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;