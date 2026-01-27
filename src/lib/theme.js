'use client'
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#008060',
            light: '#00A578',
            dark: '#006D50',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#5C6AC4',
            light: '#7C8FDA',
            dark: '#4959B0',
        },
        error: {
            main: '#D72C0D',
            light: '#FF5B3E',
            dark: '#B82100',
        },
        warning: {
            main: '#FFC453',
            light: '#FFD685',
            dark: '#F5B231',
        },
        success: {
            main: '#008060',
            light: '#00A578',
            dark: '#006D50',
        },
        background: {
            default: '#F1F2F4',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#202223',
            secondary: '#6D7175',
        },
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.25,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '0.9375rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.8125rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 1px 0 0 rgba(0,0,0,.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 0 0 rgba(0,0,0,.05)',
                    borderRadius: 12,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#C9CCCF',
                        },
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #E1E3E5',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#F6F6F7',
                        borderBottom: '1px solid #E1E3E5',
                    },
                },
            },
        },
    },
});

export default theme;