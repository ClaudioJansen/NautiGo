import { useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import HistoryIcon from '@mui/icons-material/History'
import Footer from '../components/Footer'

const DashboardPassageiroPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <DirectionsBoatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            NautiGo
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Olá, {user?.nome}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/perfil')}>
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
          Bem-vindo, {user?.nome}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Gerencie suas viagens e solicite transporte aquático
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                border: '2px solid transparent',
                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #0d47a1, #00acc1) border-box',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(13, 71, 161, 0.25)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
                    mb: 3,
                    boxShadow: '0 8px 24px rgba(13, 71, 161, 0.3)',
                  }}
                >
                  <AddIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Solicitar Viagem
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Solicite uma viagem de barco para seu destino
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/passageiro/viagens/solicitar')}
                  sx={{
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  Nova Solicitação
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                border: '1px solid rgba(13, 71, 161, 0.1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(13, 71, 161, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
                    mb: 3,
                    boxShadow: '0 8px 24px rgba(0, 172, 193, 0.3)',
                  }}
                >
                  <HistoryIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Minhas Viagens
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Visualize o histórico de suas viagens
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/passageiro/viagens')}
                  sx={{
                    borderColor: '#0d47a1',
                    color: '#0d47a1',
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#1565c0',
                      background: 'rgba(13, 71, 161, 0.04)',
                    },
                  }}
                >
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default DashboardPassageiroPage

