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
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PaymentIcon from '@mui/icons-material/Payment'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import StarIcon from '@mui/icons-material/Star'
import { Rating } from '@mui/material'
import axios from 'axios'
import AvaliarViagemDialog from '../components/AvaliarViagemDialog'

interface Viagem {
  id: number
  origem: string
  destino: string
  metodoPagamento: string
  status: string
  dataHoraSolicitada: string
  dataHoraAgendada: string | null
  passageiroNome: string
  notaMediaPassageiro?: number | null
  numeroPessoas: number
  observacoes: string | null
  valor: number | null
  valorPropostoPassageiro: number | null
  valorContraPropostaMarinheiro: number | null
}

const DetalhesViagemMarinheiroPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [dialogAvaliacaoAberto, setDialogAvaliacaoAberto] = useState(false)
  const [jaAvaliou, setJaAvaliou] = useState(false)

  useEffect(() => {
    carregarViagem(true) // Primeira carga com loading
    // Atualizar a cada 5 segundos para pegar mudanças de status
    const interval = setInterval(() => carregarViagem(false), 5000)
    return () => clearInterval(interval)
  }, [id])

  const carregarViagem = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true)
      }
      const response = await axios.get('http://localhost:8080/api/marinheiro/viagens', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const viagemEncontrada = response.data.find((v: Viagem) => v.id === Number(id))
      if (viagemEncontrada) {
        setViagem(viagemEncontrada)
        setErro('')
        
        // Verificar se viagem foi concluída e se já foi avaliada
        if (viagemEncontrada.status === 'CONCLUIDA') {
          const handledKey = `viagem_${viagemEncontrada.id}_marinheiro_finalizada`
          const jaTratouConclusao = localStorage.getItem(handledKey) === 'true'

          if (!jaTratouConclusao) {
            try {
              const verificarResponse = await axios.get(
                `http://localhost:8080/api/avaliacoes/viagens/${id}/verificar`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                }
              )
              setJaAvaliou(verificarResponse.data.jaAvaliou)
              
              // Se não avaliou ainda, mostrar dialog após um pequeno delay
              if (!verificarResponse.data.jaAvaliou && !dialogAvaliacaoAberto) {
                setTimeout(() => {
                  setDialogAvaliacaoAberto(true)
                }, 1500)
              }

              // Se já avaliou anteriormente (outro dispositivo), marcar como tratado
              if (verificarResponse.data.jaAvaliou) {
                localStorage.setItem(handledKey, 'true')
              }
            } catch (error) {
              // Se der erro, tentar mostrar dialog mesmo assim
              if (!dialogAvaliacaoAberto) {
                setTimeout(() => {
                  setDialogAvaliacaoAberto(true)
                }, 1500)
              }
            }
          }
        }
      } else {
        // Se a viagem deixou de existir para este marinheiro (por exemplo, passageiro recusou a contra-proposta),
        // voltar para a lista de corridas em vez de exibir erro de "não encontrada"
        if (!isInitialLoad) {
          navigate('/marinheiro/viagens/disponiveis', {
            state: {
              info: 'O passageiro recusou sua proposta.'
            }
          })
          return
        }
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

  const iniciarViagem = async () => {
    if (!viagem) return
    
    try {
      setErro('')
      await axios.post(`http://localhost:8080/api/marinheiro/viagens/${viagem.id}/iniciar`, {}, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      })
      setSucesso('Viagem iniciada com sucesso!')
      // Recarregar a viagem para atualizar o status
      setTimeout(() => {
        carregarViagem(true)
      }, 500)
    } catch (error: any) {
      console.error('Erro ao iniciar viagem:', error)
      setErro(error.response?.data?.message || 'Erro ao iniciar viagem')
    }
  }

  const concluirViagem = async () => {
    if (!viagem) return
    
    if (!window.confirm('Tem certeza que deseja concluir esta viagem? Confirme que chegou ao destino.')) {
      return
    }
    
    try {
      setErro('')
      await axios.post(`http://localhost:8080/api/marinheiro/viagens/${viagem.id}/concluir`, {}, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      })
      setSucesso('Viagem concluída com sucesso!')
      // Recarregar a viagem para atualizar o status e permitir avaliação
      setTimeout(() => {
        carregarViagem(true)
      }, 500)
    } catch (error: any) {
      console.error('Erro ao concluir viagem:', error)
      setErro(error.response?.data?.message || 'Erro ao concluir viagem')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'warning'
      case 'AGUARDANDO_APROVACAO_PASSAGEIRO':
        return 'info'
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
        return 'Pendente'
      case 'AGUARDANDO_APROVACAO_PASSAGEIRO':
        return 'Aguardando aprovação do passageiro'
      case 'ACEITA':
        return 'Aceita - Aguardando início'
      case 'EM_ANDAMENTO':
        return 'Em Andamento'
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

  const formatCurrency = (value: number | null) => {
    if (value == null) return '-'
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (loading && !viagem) {
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
          <Button onClick={() => navigate('/marinheiro/viagens')}>
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
          <IconButton edge="start" color="inherit" onClick={() => navigate('/marinheiro/viagens')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <DirectionsBoatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Detalhes da Corrida
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
              Viagem de {viagem.passageiroNome}
            </Typography>
            <Chip
              label={getStatusLabel(viagem.status)}
              color={getStatusColor(viagem.status) as any}
              sx={{ fontWeight: 600, fontSize: '0.9rem', py: 2.5 }}
            />
          </Box>

          {erro && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setErro('')}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setSucesso('')}>
              {sucesso}
            </Alert>
          )}

          {viagem.status === 'ACEITA' && (
            <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Viagem aceita! Você está a caminho
              </Typography>
              <Typography variant="body2">
                Dirija-se ao ponto de origem indicado abaixo para buscar o passageiro. Quando chegar, clique em "Iniciar Viagem".
              </Typography>
            </Alert>
          )}

          {viagem.status === 'EM_ANDAMENTO' && (
            <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Viagem em andamento
              </Typography>
              <Typography variant="body2">
                Você está transportando o passageiro para o destino. Quando chegar ao destino, clique em "Concluir Viagem".
              </Typography>
            </Alert>
          )}

          {viagem.status === 'CONCLUIDA' && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Viagem concluída com sucesso!
              </Typography>
              <Typography variant="body2">
                A viagem foi finalizada. Obrigado por usar o NautiGo!
              </Typography>
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)', background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 100%)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Passageiro
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4, fontWeight: 500 }}>
                    {viagem.passageiroNome}
                  </Typography>
                  {viagem.notaMediaPassageiro !== undefined && viagem.notaMediaPassageiro !== null && (
                    <Box sx={{ pl: 4, mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={viagem.notaMediaPassageiro}
                        readOnly
                        precision={0.1}
                        size="small"
                        icon={<StarIcon sx={{ fontSize: 20 }} />}
                        emptyIcon={<StarIcon sx={{ fontSize: 20, opacity: 0.3 }} />}
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#ffc107',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <strong>{viagem.notaMediaPassageiro.toFixed(1)}</strong> / 5.0
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Origem
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4, fontWeight: 500, fontSize: '1.1rem' }}>
                    {viagem.origem}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(13, 71, 161, 0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PaymentIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Valor da Viagem
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 4 }}>
                    {viagem.status === 'PENDENTE' && (
                      <>Passageiro propôs {formatCurrency(viagem.valorPropostoPassageiro)}</>
                    )}
                    {viagem.status === 'AGUARDANDO_APROVACAO_PASSAGEIRO' && (
                      <>
                        Você propôs {formatCurrency(viagem.valorContraPropostaMarinheiro)}. Aguardando aprovação do passageiro.
                      </>
                    )}
                    {['ACEITA', 'EM_ANDAMENTO', 'CONCLUIDA'].includes(viagem.status) && (
                      <>Valor acordado: {formatCurrency(viagem.valor)}</>
                    )}
                    {viagem.status === 'CANCELADA' && (
                      <>Viagem cancelada. Valor não será cobrado pela plataforma.</>
                    )}
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
                  <Typography variant="body1" sx={{ pl: 4, fontWeight: 500, fontSize: '1.1rem' }}>
                    {viagem.destino}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

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
                      Observações do Passageiro
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

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {viagem.status === 'ACEITA' && (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={iniciarViagem}
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                }}
              >
                Iniciar Viagem
              </Button>
            )}

            {viagem.status === 'EM_ANDAMENTO' && (
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={concluirViagem}
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                }}
              >
                Concluir Viagem
              </Button>
            )}

            {(viagem.status === 'PENDENTE' || viagem.status === 'ACEITA') && (
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={async () => {
                  if (!window.confirm('Tem certeza que deseja cancelar esta viagem?')) {
                    return
                  }
                  try {
                    await axios.post(`http://localhost:8080/api/marinheiro/viagens/${viagem.id}/cancelar`, {}, {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                      }
                    })
                    navigate('/marinheiro/viagens')
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

      {viagem && viagem.status === 'CONCLUIDA' && (
        <AvaliarViagemDialog
          open={dialogAvaliacaoAberto && !jaAvaliou}
          onClose={() => setDialogAvaliacaoAberto(false)}
          viagemId={viagem.id}
          avaliadoNome={viagem.passageiroNome}
          onAvaliacaoConcluida={() => {
            const handledKey = `viagem_${viagem.id}_marinheiro_finalizada`
            localStorage.setItem(handledKey, 'true')
            setJaAvaliou(true)
            setDialogAvaliacaoAberto(false)
            navigate('/marinheiro/dashboard', {
              state: { success: 'Viagem concluída com sucesso!' }
            })
          }}
        />
      )}
    </Box>
  )
}

export default DetalhesViagemMarinheiroPage

