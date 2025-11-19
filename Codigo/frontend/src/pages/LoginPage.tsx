import { useState } from 'react'
import { Container, Box, TextField, Button, Typography, Paper, Alert, AppBar, Toolbar, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    try {
      await login(email, senha)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.isAdmin) {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao fazer login')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <DirectionsBoatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            NautiGo
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box sx={{ py: 8 }}>
          <Paper
            elevation={8}
            sx={{
              p: 5,
              borderRadius: 3,
              background: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(13, 71, 161, 0.3)',
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                Bem-vindo de volta
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Faça login para continuar
              </Typography>
            </Box>

            {erro && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {erro}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                autoComplete="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                margin="normal"
                autoComplete="current-password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                  boxShadow: '0 4px 14px 0 rgba(13, 71, 161, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px 0 rgba(13, 71, 161, 0.5)',
                  },
                }}
              >
                Entrar
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate('/')}
                sx={{
                  textTransform: 'none',
                  color: 'text.secondary',
                }}
              >
                Voltar para a página inicial
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage
