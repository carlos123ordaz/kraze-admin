import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '../context/AuthContext';
import theme from '../lib/theme';
import './globals.css';

export const metadata = {
  title: 'Kraze Store - Admin',
  description: 'Panel de administración de Kraze Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}