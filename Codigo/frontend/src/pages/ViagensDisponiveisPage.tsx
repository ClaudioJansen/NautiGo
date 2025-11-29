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
  DialogContentText,
  TextField
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
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
   valorPropostoPassageiro: number | null
}

const ViagensDisponiveisPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info'>('success')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [viagemSelecionada, setViagemSelecionada] = useState<Viagem | null>(null)
  const [novoValorCentavos, setNovoValorCentavos] = useState(0)

  useEffect(() => {
    // Mensagem vinda de outras telas (por exemplo, passageiro recusou a proposta)
    if ((location.state as any)?.info) {
      setSucesso((location.state as any).info)
      setAlertSeverity('info')
      // Limpar o state da URL para não repetir a mensagem em futuros navigates
      window.history.replaceState({}, document.title)
    }

    carregarViagens()
    // Recarregar a cada 10 segundos para pegar novas viagens
    const interval = setInterval(carregarViagens, 10000)
    return () => clearInterval(interval)
  }, [location.state])

  // Esconder automaticamente mensagens de sucesso/info após alguns segundos
  useEffect(() => {
    if (!sucesso) return

    const timer = setTimeout(() => {
      setSucesso('')
    }, 4000)

    return () => clearTimeout(timer)
  }, [sucesso])

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
    const base = viagem.valorPropostoPassageiro != null ? Math.round(viagem.valorPropostoPassageiro * 100) : 0
    setNovoValorCentavos(base)
    setDialogAberto(true)
  }

  const fecharDialog = () => {
    setDialogAberto(false)
    setViagemSelecionada(null)
    setNovoValorCentavos(0)
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
      setAlertSeverity('success')
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

  const recusarViagem = async (viagem: Viagem) => {
    try {
      await axios.post(
        `http://localhost:8080/api/marinheiro/viagens/${viagem.id}/recusar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setSucesso('Viagem recusada com sucesso!')
      setAlertSeverity('success')
      fecharDialog()
      // Recarregar lista para remover a viagem recusada
      carregarViagens()
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao recusar viagem')
      fecharDialog()
    }
  }

  const enviarContraProposta = async () => {
    if (!viagemSelecionada) return
    if (!novoValorCentavos || novoValorCentavos <= 0) {
      setErro('Informe um valor válido para a contra-proposta')
      return
    }

    try {
      await axios.post(
        `http://localhost:8080/api/marinheiro/viagens/${viagemSelecionada.id}/contra-proposta`,
        { novoValor: novoValorCentavos / 100 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setSucesso('Contra-proposta enviada para o passageiro!')
      setAlertSeverity('success')
      fecharDialog()
      // Ir direto para a tela de detalhes dessa viagem para o marinheiro acompanhar o status
      setTimeout(() => {
        navigate(`/marinheiro/viagens/${viagemSelecionada.id}`)
      }, 500)
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao enviar contra-proposta')
      console.error(error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatCurrency = (valor: number) => {
    return (valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleNovoValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Remove tudo que não é dígito
    let newCentavos = parseInt(value || '0', 10)

    // Limita a 9 dígitos para evitar números muito grandes
    if (value.length > 9) {
      newCentavos = parseInt(value.substring(0, 9), 10)
    }

    setNovoValorCentavos(newCentavos)
    setErro('')
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
          <Alert severity={alertSeverity} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSucesso('')}>
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
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Valor Proposto</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Data/Hora</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ação</TableCell>
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
                    <TableCell>
                      {viagem.valorPropostoPassageiro != null ? (
                        <Chip
                          label={`R$ ${viagem.valorPropostoPassageiro.toFixed(2)}`}
                          size="small"
                          color="success"
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{formatDate(viagem.dataHoraAgendada || viagem.dataHoraSolicitada)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
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
                          Analisar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => recusarViagem(viagem)}
                          sx={{ textTransform: 'none' }}
                        >
                          Recusar
                        </Button>
                      </Box>
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
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Valor proposto pelo passageiro:</strong>{' '}
                {viagemSelecionada.valorPropostoPassageiro != null
                  ? `R$ ${viagemSelecionada.valorPropostoPassageiro.toFixed(2)}`
                  : 'Não informado'}
              </Typography>
              {viagemSelecionada.observacoes && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Observações:</strong> {viagemSelecionada.observacoes}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, flexDirection: 'column', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            {viagemSelecionada && (
              <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                Se preferir, você pode propor um novo valor ao passageiro.
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <TextField
                label="Novo valor (R$)"
                type="text"
                size="small"
                value={`R$ ${(novoValorCentavos / 100).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                onChange={handleNovoValorChange}
                sx={{ flexGrow: 1, maxWidth: 200 }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <Button
                onClick={enviarContraProposta}
                variant="contained"
                color="secondary"
                sx={{
                  textTransform: 'none',
                }}
              >
                Enviar novo valor
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button onClick={fecharDialog} sx={{ textTransform: 'none' }}>
              Fechar
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {viagemSelecionada && (
                <Button
                  onClick={() => recusarViagem(viagemSelecionada)}
                  color="error"
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                >
                  Recusar
                </Button>
              )}
              <Button
                onClick={aceitarViagem}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                }}
              >
                Aceitar
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ViagensDisponiveisPage

