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
  Button, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

interface Marinheiro {
  id: number
  usuarioId: number
  nome: string
  email: string
  telefone: string
  numeroDocumentoMarinha: string
  tipoEmbarcacao: string
  nomeEmbarcacao: string
  numeroRegistroEmbarcacao: string
  capacidadePassageiros: number
  statusAprovacao: string
  observacoes: string | null
  dataCriacao: string
}

const AdminDashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [marinheiros, setMarinheiros] = useState<Marinheiro[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [marinheiroSelecionado, setMarinheiroSelecionado] = useState<Marinheiro | null>(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState('')
  const [acao, setAcao] = useState<'aprovar' | 'rejeitar' | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/')
      return
    }
    carregarMarinheiros()
  }, [isAuthenticated, user, navigate])

  const carregarMarinheiros = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/admin/marinheiros/pendentes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setMarinheiros(response.data)
      setErro('')
    } catch (error: any) {
      setErro('Erro ao carregar marinheiros pendentes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const abrirDialog = (marinheiro: Marinheiro, acao: 'aprovar' | 'rejeitar') => {
    setMarinheiroSelecionado(marinheiro)
    setAcao(acao)
    setMotivoRejeicao('')
    setDialogAberto(true)
  }

  const fecharDialog = () => {
    setDialogAberto(false)
    setMarinheiroSelecionado(null)
    setAcao(null)
    setMotivoRejeicao('')
  }

  const confirmarAcao = async () => {
    if (!marinheiroSelecionado) return

    try {
      if (acao === 'aprovar') {
        await axios.post(
          `http://localhost:8080/api/admin/marinheiros/${marinheiroSelecionado.id}/aprovar`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setSucesso('Marinheiro aprovado com sucesso!')
      } else {
        await axios.post(
          `http://localhost:8080/api/admin/marinheiros/${marinheiroSelecionado.id}/rejeitar`,
          { motivo: motivoRejeicao || 'Cadastro rejeitado pelo administrador' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setSucesso('Marinheiro rejeitado com sucesso!')
      }
      fecharDialog()
      carregarMarinheiros()
      setTimeout(() => setSucesso(''), 3000)
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao processar ação')
      console.error(error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <AdminPanelSettingsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Painel de Administração
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.nome}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
            Aprovação de Cadastros
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Revise e aprove ou rejeite os cadastros de marinheiros pendentes
          </Typography>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErro('')}>
            {erro}
          </Alert>
        )}

        {sucesso && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSucesso('')}>
            {sucesso}
          </Alert>
        )}

        {marinheiros.length === 0 ? (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <DirectionsBoatIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                Nenhum cadastro pendente
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Todos os cadastros foram processados
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nome</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Telefone</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Documento</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Embarcação</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Capacidade</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Data</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marinheiros.map((marinheiro) => (
                  <TableRow 
                    key={marinheiro.id}
                    sx={{
                      '&:hover': {
                        background: 'rgba(13, 71, 161, 0.04)',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{marinheiro.nome}</TableCell>
                    <TableCell>{marinheiro.email}</TableCell>
                    <TableCell>{marinheiro.telefone}</TableCell>
                    <TableCell>{marinheiro.numeroDocumentoMarinha}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {marinheiro.nomeEmbarcacao}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {marinheiro.tipoEmbarcacao}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{marinheiro.capacidadePassageiros}</TableCell>
                    <TableCell>
                      {new Date(marinheiro.dataCriacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => abrirDialog(marinheiro, 'aprovar')}
                          sx={{
                            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
                            },
                          }}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => abrirDialog(marinheiro, 'rejeitar')}
                          sx={{
                            background: 'linear-gradient(135deg, #c62828 0%, #f44336 100%)',
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(198, 40, 40, 0.3)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(198, 40, 40, 0.4)',
                            },
                          }}
                        >
                          Rejeitar
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
        <DialogTitle sx={{ fontWeight: 600, pb: 2 }}>
          {acao === 'aprovar' ? 'Aprovar Marinheiro' : 'Rejeitar Marinheiro'}
        </DialogTitle>
        <DialogContent>
          {marinheiroSelecionado && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Nome</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{marinheiroSelecionado.nome}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{marinheiroSelecionado.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Embarcação</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {marinheiroSelecionado.nomeEmbarcacao} ({marinheiroSelecionado.tipoEmbarcacao})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Documento Marinha</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{marinheiroSelecionado.numeroDocumentoMarinha}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Registro da Embarcação</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{marinheiroSelecionado.numeroRegistroEmbarcacao}</Typography>
                </Grid>
              </Grid>
              {acao === 'rejeitar' && (
                <TextField
                  fullWidth
                  label="Motivo da rejeição (opcional)"
                  multiline
                  rows={3}
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
              {acao === 'aprovar' && (
                <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
                  Tem certeza que deseja aprovar este cadastro? O marinheiro poderá começar a receber solicitações de viagens.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={fecharDialog}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmarAcao}
            variant="contained"
            sx={{
              textTransform: 'none',
              background: acao === 'aprovar' 
                ? 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)'
                : 'linear-gradient(135deg, #c62828 0%, #f44336 100%)',
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminDashboardPage
