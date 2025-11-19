import { useState } from 'react'
import { Container, Box, TextField, Button, Typography, Paper, Alert, AppBar, Toolbar, IconButton, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const CadastroPassageiroPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso(false)

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      await axios.post('http://localhost:8080/api/auth/cadastro/passageiro', {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha
      })
      
      setSucesso(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao cadastrar')
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
        <Box sx={{ py: 6 }}>
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
                <PersonAddIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                Cadastro de Passageiro
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Crie sua conta e comece a solicitar viagens
              </Typography>
            </Box>

            {erro && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {erro}
              </Alert>
            )}

            {sucesso && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Cadastro realizado com sucesso! Redirecionando para login...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Divider sx={{ my: 3 }} />
              <TextField
                fullWidth
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                required
                margin="normal"
                helperText="Mínimo de 6 caracteres"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirmar senha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                margin="normal"
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
                Criar Conta
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
                Voltar
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default CadastroPassageiroPage
