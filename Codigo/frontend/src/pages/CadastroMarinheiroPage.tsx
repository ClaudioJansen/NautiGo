import { useState } from 'react'
import { Container, Box, TextField, Button, Typography, Paper, Alert, AppBar, Toolbar, IconButton, Divider, Chip, Checkbox, FormControlLabel, Link } from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BadgeIcon from '@mui/icons-material/Badge'
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined'

const CadastroMarinheiroPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    numeroDocumentoMarinha: '',
    tipoEmbarcacao: '',
    nomeEmbarcacao: '',
    numeroRegistroEmbarcacao: '',
    capacidadePassageiros: ''
  })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [aceitarTermos, setAceitarTermos] = useState(false)
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
      await axios.post('http://localhost:8080/api/auth/cadastro/marinheiro', {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        numeroDocumentoMarinha: formData.numeroDocumentoMarinha,
        tipoEmbarcacao: formData.tipoEmbarcacao,
        nomeEmbarcacao: formData.nomeEmbarcacao,
        numeroRegistroEmbarcacao: formData.numeroRegistroEmbarcacao,
        capacidadePassageiros: parseInt(formData.capacidadePassageiros)
      })
      
      setSucesso(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
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

      <Container maxWidth="md">
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
                  background: 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(0, 172, 193, 0.3)',
                }}
              >
                <BadgeIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                Cadastro de Marinheiro
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Preencha seus dados para se tornar um marinheiro parceiro
              </Typography>
              <Chip
                label="Cadastro sujeito à aprovação"
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {erro && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {erro}
              </Alert>
            )}

            {sucesso && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Cadastro realizado com sucesso! Seu perfil está aguardando aprovação. Você receberá um email quando for aprovado.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Dados Pessoais
                </Typography>
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
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsBoatOutlinedIcon sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                    Dados Profissionais e da Embarcação
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Número do Documento da Marinha"
                  name="numeroDocumentoMarinha"
                  value={formData.numeroDocumentoMarinha}
                  onChange={handleChange}
                  required
                  margin="normal"
                  helperText="Documento que comprova sua habilitação para navegação"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Tipo de Embarcação"
                  name="tipoEmbarcacao"
                  value={formData.tipoEmbarcacao}
                  onChange={handleChange}
                  required
                  margin="normal"
                  helperText="Ex: Lancha, Barco, Catamarã"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Nome da Embarcação"
                  name="nomeEmbarcacao"
                  value={formData.nomeEmbarcacao}
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
                  label="Número de Registro da Embarcação"
                  name="numeroRegistroEmbarcacao"
                  value={formData.numeroRegistroEmbarcacao}
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
                  label="Capacidade de Passageiros"
                  name="capacidadePassageiros"
                  type="number"
                  value={formData.capacidadePassageiros}
                  onChange={handleChange}
                  required
                  margin="normal"
                  inputProps={{ min: 1 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={aceitarTermos}
                      onChange={(e) => setAceitarTermos(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Eu concordo com os{' '}
                      <Link 
                        component={RouterLink} 
                        to="/termos-uso" 
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        Termos de Uso
                      </Link>
                      {' '}e{' '}
                      <Link 
                        component={RouterLink} 
                        to="/politica-privacidade" 
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        Política de Privacidade
                      </Link>
                    </Typography>
                  }
                />
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!aceitarTermos}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)',
                  boxShadow: '0 4px 14px 0 rgba(0, 172, 193, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px 0 rgba(0, 172, 193, 0.5)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                Enviar Cadastro
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

export default CadastroMarinheiroPage
