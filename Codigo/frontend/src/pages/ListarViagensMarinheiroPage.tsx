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
  Pagination
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
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
}

const ListarViagensMarinheiroPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  useEffect(() => {
    carregarViagens(page)
  }, [page])

  const carregarViagens = async (currentPage: number) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8080/api/marinheiro/viagens?page=${currentPage}&size=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setViagens(response.data.content)
      setTotalPages(response.data.totalPages)
      setTotalElements(response.data.totalElements)
      setErro('')
    } catch (error: any) {
      setErro('Erro ao carregar viagens')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1) // Material-UI Pagination usa 1-based, backend usa 0-based
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

  const getStatusLabel = (status: string, dataHoraAgendada: string | null = null) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente'
      case 'AGUARDANDO_APROVACAO_PASSAGEIRO':
        return 'Aguardando aprovação do passageiro'
      case 'ACEITA':
        return dataHoraAgendada ? 'Agendado' : 'Aceita'
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

  if (loading) {
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
            Minhas Viagens
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Histórico de Viagens
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/marinheiro/viagens/disponiveis')}
            sx={{
              background: 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)',
              textTransform: 'none',
            }}
          >
            Ver Disponíveis
          </Button>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErro('')}>
            {erro}
          </Alert>
        )}

        {viagens.length === 0 && !loading ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <DirectionsBoatIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              Nenhuma viagem ainda
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Aceite viagens disponíveis para começar
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/marinheiro/viagens/disponiveis')}
              sx={{
                background: 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)',
                textTransform: 'none',
              }}
            >
              Ver Viagens Disponíveis
            </Button>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Passageiro</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Origem</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Destino</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pagamento</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Data/Hora</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viagens.map((viagem) => (
                    <TableRow
                      key={viagem.id}
                      onClick={() => navigate(`/marinheiro/viagens/${viagem.id}`)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(13, 71, 161, 0.04)',
                        },
                      }}
                    >
                      <TableCell>{viagem.passageiroNome}</TableCell>
                      <TableCell>{viagem.origem}</TableCell>
                      <TableCell>{viagem.destino}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(viagem.status, viagem.dataHoraAgendada)}
                          color={getStatusColor(viagem.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{viagem.metodoPagamento === 'DINHEIRO' ? 'Dinheiro' : 'PIX'}</TableCell>
                      <TableCell>{formatDate(viagem.dataHoraAgendada || viagem.dataHoraSolicitada)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default ListarViagensMarinheiroPage

