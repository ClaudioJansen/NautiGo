import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CadastroPassageiroPage from './pages/CadastroPassageiroPage'
import CadastroMarinheiroPage from './pages/CadastroMarinheiroPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import { AuthProvider } from './contexts/AuthContext'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1',
      light: '#1565c0',
      dark: '#0277bd',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00acc1',
      light: '#26c6da',
      dark: '#00838f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.75rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(13, 71, 161, 0.39)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(13, 71, 161, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        elevation3: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/passageiro/cadastro" element={<CadastroPassageiroPage />} />
            <Route path="/marinheiro/cadastro" element={<CadastroMarinheiroPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

