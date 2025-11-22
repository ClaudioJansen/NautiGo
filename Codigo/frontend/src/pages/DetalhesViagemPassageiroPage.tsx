import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PaymentIcon from '@mui/icons-material/Payment'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import axios from 'axios'

interface Viagem {
  id: number
  origem: string
  destino: string
  metodoPagamento: string
  status: string
  dataHoraSolicitada: string
  dataHoraAgendada: string | null
  marinheiroNome: string | null
  marinheiroId: number | null
  nomeBarco: string | null
  numeroPessoas: number
  observacoes: string | null
}

const DetalhesViagemPassageiroPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarViagem(true) // Primeira carga com loading
    // Atualizar a cada 5 segundos para pegar mudanças de status (quando marinheiro aceita)
    const interval = setInterval(() => carregarViagem(false), 5000)
    return () => clearInterval(interval)
  }, [id])

  const carregarViagem = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true)
      }
      const response = await axios.get('http://localhost:8080/api/passageiro/viagens', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const viagemEncontrada = response.data.find((v: Viagem) => v.id === Number(id))
      if (viagemEncontrada) {
        setViagem(viagemEncontrada)
        setErro('')
      } else {
        setErro('Viagem não encontrada')
      }
    } catch (error: any) {
      setErro('Erro ao carregar viagem')
      console.error(error)
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'warning'
      case 'ACEITA':
        return 'info'
      case 'EM_ANDAMENTO':
        return 'primary'
      case 'CONCLUIDA':
        return 'success'
      case 'CANCELADA':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'Aguardando aceitação'
      case 'ACEITA':
        return 'Marinheiro a caminho'
      case 'EM_ANDAMENTO':
        return 'Em andamento'
      case 'CONCLUIDA':
        return 'Concluída'
      case 'CANCELADA':
        return 'Cancelada'
      default:
        return status
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (erro || !viagem) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro || 'Viagem não encontrada'}
          </Alert>
          <Button onClick={() => navigate('/passageiro/viagens')}>
            Voltar
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/passageiro/viagens')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <DirectionsBoatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Detalhes da Viagem
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Viagem #{viagem.id}
            </Typography>
            <Chip
              label={getStatusLabel(viagem.status)}
              color={getStatusColor(viagem.status) as any}
              sx={{ fontWeight: 600, fontSize: '0.9rem', py: 2.5 }}
            />
          </Box>

          {viagem.status === 'PENDENTE' && (
            <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Aguardando aceitação
              </Typography>
              <Typography variant="body2">
                Sua solicitação está aguardando um marinheiro disponível aceitar.
              </Typography>
            </Alert>
          )}

          {viagem.status === 'ACEITA' && (
            <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Marinheiro a caminho!
              </Typography>
              <Typography variant="body2">
                <strong>{viagem.marinheiroNome}</strong> aceitou sua solicitação e está se dirigindo ao ponto de partida. Aguarde na origem indicada.
              </Typography>
            </Alert>
          )}

          {viagem.status === 'EM_ANDAMENTO' && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Viagem em andamento
              </Typography>
              <Typography variant="body2">
                Você está sendo transportado por <strong>{viagem.marinheiroNome}</strong> para o destino. Aproveite a viagem!
              </Typography>
            </Alert>
          )}

          {viagem.status === 'CONCLUIDA' && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Viagem concluída!
              </Typography>
              <Typography variant="body2">
                Sua viagem foi finalizada com sucesso. Obrigado por usar o NautiGo!
              </Typography>
            </Alert>
          )}

          {viagem.status === 'CANCELADA' && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Viagem cancelada
              </Typography>
              <Typography variant="body2">
                Esta viagem foi cancelada.
              </Typography>
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Origem
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4 }}>
                    {viagem.origem}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Destino
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4 }}>
                    {viagem.destino}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {viagem.marinheiroNome && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)', background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 100%)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Marinheiro Responsável
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ pl: 4, fontWeight: 500, mb: 1 }}>
                      {viagem.marinheiroNome}
                    </Typography>
                    {viagem.nomeBarco && (
                      <Typography variant="body2" sx={{ pl: 4, color: 'text.secondary' }}>
                        <strong>Barco:</strong> {viagem.nomeBarco}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Número de Pessoas
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4 }}>
                    {viagem.numeroPessoas} {viagem.numeroPessoas === 1 ? 'pessoa' : 'pessoas'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PaymentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Método de Pagamento
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4 }}>
                    {viagem.metodoPagamento === 'DINHEIRO' ? 'Dinheiro' : 'PIX'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Data/Hora
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4 }}>
                    {formatDate(viagem.dataHoraAgendada || viagem.dataHoraSolicitada)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {viagem.observacoes && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Observações
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {viagem.observacoes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/passageiro/viagens')}
              sx={{
                textTransform: 'none',
                borderColor: '#0d47a1',
                color: '#0d47a1',
              }}
            >
              Voltar para Lista
            </Button>
            {(viagem.status === 'PENDENTE' || viagem.status === 'ACEITA') && (
              <Button
                variant="contained"
                color="error"
                onClick={async () => {
                  if (!window.confirm('Tem certeza que deseja cancelar esta viagem?')) {
                    return
                  }
                  try {
                    await axios.post(`http://localhost:8080/api/passageiro/viagens/${viagem.id}/cancelar`, {}, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                      }
                    })
                    navigate('/passageiro/viagens')
                  } catch (error: any) {
                    alert(error.response?.data?.message || 'Erro ao cancelar viagem')
                    console.error('Erro ao cancelar:', error)
                  }
                }}
                sx={{
                  textTransform: 'none',
                }}
              >
                Cancelar Viagem
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default DetalhesViagemPassageiroPage

