import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import { Rating } from '@mui/material'
import axios from 'axios'

interface Viagem {
  id: number
  origem: string
  destino: string
  metodoPagamento: string
  status: string
  dataHoraSolicitada: string
  dataHoraAgendada: string | null
  passageiroNome: string
  numeroPessoas: number
  notaMediaPassageiro: number | null
  observacoes: string | null
}

const ViagensDisponiveisPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [viagemSelecionada, setViagemSelecionada] = useState<Viagem | null>(null)

  useEffect(() => {
    carregarViagens()
    // Recarregar a cada 10 segundos para pegar novas viagens
    const interval = setInterval(carregarViagens, 10000)
    return () => clearInterval(interval)
  }, [])

  const carregarViagens = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/marinheiro/viagens/disponiveis', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setViagens(response.data)
      setErro('')
    } catch (error: any) {
      setErro('Erro ao carregar viagens disponíveis')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const abrirDialog = (viagem: Viagem) => {
    setViagemSelecionada(viagem)
    setDialogAberto(true)
  }

  const fecharDialog = () => {
    setDialogAberto(false)
    setViagemSelecionada(null)
  }

  const aceitarViagem = async () => {
    if (!viagemSelecionada) return

    try {
      await axios.post(
        `http://localhost:8080/api/marinheiro/viagens/${viagemSelecionada.id}/aceitar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setSucesso('Viagem aceita com sucesso!')
      fecharDialog()
      // Redirecionar para detalhes da viagem aceita
      setTimeout(() => {
        navigate(`/marinheiro/viagens/${viagemSelecionada.id}`)
      }, 1000)
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao aceitar viagem')
      fecharDialog()
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  if (loading && viagens.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/marinheiro/dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <DirectionsBoatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Corridas Disponíveis
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
          Viagens Disponíveis
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Aceite corridas que correspondem às suas habilidades
        </Typography>

        {sucesso && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSucesso('')}>
            {sucesso}
          </Alert>
        )}

        {erro && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErro('')}>
            {erro}
          </Alert>
        )}

        {viagens.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <DirectionsBoatIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              Nenhuma corrida disponível
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Novas corridas aparecerão aqui quando passageiros solicitarem viagens
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Passageiro</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Origem</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Destino</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pessoas</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pagamento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Data/Hora</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viagens.map((viagem) => (
                  <TableRow
                    key={viagem.id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(13, 71, 161, 0.04)',
                      },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {viagem.passageiroNome}
                        </Typography>
                        {viagem.notaMediaPassageiro !== null && viagem.notaMediaPassageiro !== undefined && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Rating
                              value={viagem.notaMediaPassageiro}
                              readOnly
                              precision={0.1}
                              size="small"
                              icon={<StarIcon sx={{ fontSize: 14 }} />}
                              emptyIcon={<StarIcon sx={{ fontSize: 14, opacity: 0.3 }} />}
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#ffc107',
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {viagem.notaMediaPassageiro.toFixed(1)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{viagem.origem}</TableCell>
                    <TableCell>{viagem.destino}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${viagem.numeroPessoas} ${viagem.numeroPessoas === 1 ? 'pessoa' : 'pessoas'}`}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={viagem.metodoPagamento === 'DINHEIRO' ? 'Dinheiro' : 'PIX'}
                        size="small"
                        color={viagem.metodoPagamento === 'PIX' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(viagem.dataHoraAgendada || viagem.dataHoraSolicitada)}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => abrirDialog(viagem)}
                        sx={{
                          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                          textTransform: 'none',
                          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
                          },
                        }}
                      >
                        Aceitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Dialog
        open={dialogAberto}
        onClose={fecharDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Aceitar Viagem</DialogTitle>
        <DialogContent>
          {viagemSelecionada && (
            <Box sx={{ mt: 1 }}>
              <DialogContentText sx={{ mb: 2 }}>
                Tem certeza que deseja aceitar esta viagem?
              </DialogContentText>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Passageiro:</strong> {viagemSelecionada.passageiroNome}
                </Typography>
                {viagemSelecionada.notaMediaPassageiro !== null && viagemSelecionada.notaMediaPassageiro !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <Rating
                      value={viagemSelecionada.notaMediaPassageiro}
                      readOnly
                      precision={0.1}
                      size="small"
                      icon={<StarIcon sx={{ fontSize: 18 }} />}
                      emptyIcon={<StarIcon sx={{ fontSize: 18, opacity: 0.3 }} />}
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#ffc107',
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {viagemSelecionada.notaMediaPassageiro.toFixed(1)} / 5.0
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Origem:</strong> {viagemSelecionada.origem}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Destino:</strong> {viagemSelecionada.destino}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Número de Pessoas:</strong> {viagemSelecionada.numeroPessoas} {viagemSelecionada.numeroPessoas === 1 ? 'pessoa' : 'pessoas'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Pagamento:</strong> {viagemSelecionada.metodoPagamento === 'DINHEIRO' ? 'Dinheiro' : 'PIX'}
              </Typography>
              {viagemSelecionada.observacoes && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Observações:</strong> {viagemSelecionada.observacoes}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={fecharDialog} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            onClick={aceitarViagem}
            variant="contained"
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ViagensDisponiveisPage

