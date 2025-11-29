import { useState } from 'react'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Grid,
  Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import axios from 'axios'

const SolicitarViagemPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    origem: '',
    destino: '',
    observacoes: '',
    dataHoraAgendada: '',
    metodoPagamento: 'DINHEIRO' as 'DINHEIRO' | 'PIX',
    numeroPessoas: 1,
    valorPropostoCentavos: 0
  })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value
    }))
    setErro('')
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const centavos = raw ? parseInt(raw, 10) : 0

    setFormData((prev) => ({
      ...prev,
      valorPropostoCentavos: centavos
    }))
    setErro('')
  }

  const formatCurrency = (centavos: number) => {
    const valor = centavos / 100
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    if (!formData.origem || !formData.destino) {
      setErro('Origem e destino são obrigatórios')
      setLoading(false)
      return
    }

    if (!formData.valorPropostoCentavos || formData.valorPropostoCentavos <= 0) {
      setErro('Informe um valor válido para a viagem')
      setLoading(false)
      return
    }

    try {
      const payload: any = {
        origem: formData.origem,
        destino: formData.destino,
        metodoPagamento: formData.metodoPagamento,
        numeroPessoas: formData.numeroPessoas || 1,
        valorPropostoPassageiro: formData.valorPropostoCentavos / 100
      }

      if (formData.observacoes) {
        payload.observacoes = formData.observacoes
      }

      if (formData.dataHoraAgendada) {
        payload.dataHoraAgendada = new Date(formData.dataHoraAgendada).toISOString()
      }

      const response = await axios.post('http://localhost:8080/api/passageiro/viagens', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      // Redirecionar para detalhes da viagem criada
      navigate(`/passageiro/viagens/${response.data.id}`, { state: { success: 'Viagem solicitada com sucesso!' } })
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao solicitar viagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/passageiro/dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <DirectionsBoatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Solicitar Viagem
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            Nova Solicitação de Viagem
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Preencha os dados para solicitar uma viagem
          </Typography>

          {erro && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {erro}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Origem"
                  name="origem"
                  value={formData.origem}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Porto de Santos, SP"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Destino"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Ilha das Palmas, SP"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data e Hora Agendada (opcional)"
                  name="dataHoraAgendada"
                  type="datetime-local"
                  value={formData.dataHoraAgendada}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de Pessoas"
                  name="numeroPessoas"
                  type="number"
                  value={formData.numeroPessoas}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 1, max: 100 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quanto você está disposto a pagar (R$)"
                  name="valorPropostoPassageiro"
                  type="text"
                  value={formatCurrency(formData.valorPropostoCentavos)}
                  onChange={handleValorChange}
                  required
                  inputProps={{ inputMode: 'numeric' }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Método de Pagamento"
                  name="metodoPagamento"
                  value={formData.metodoPagamento}
                  onChange={handleChange}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
                  <MenuItem value="PIX">PIX</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações (opcional)"
                  name="observacoes"
                  multiline
                  rows={4}
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre a viagem..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/passageiro/dashboard')}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderColor: '#0d47a1',
                  color: '#0d47a1',
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                  boxShadow: '0 4px 14px 0 rgba(13, 71, 161, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px 0 rgba(13, 71, 161, 0.5)',
                  },
                }}
              >
                {loading ? 'Solicitando...' : 'Solicitar Viagem'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default SolicitarViagemPage

