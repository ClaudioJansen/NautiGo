import { Container, Typography, Box, Button, Grid, Card, CardContent, AppBar, Toolbar } from '@mui/material'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import PersonIcon from '@mui/icons-material/Person'
import WavesIcon from '@mui/icons-material/Waves'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PaymentIcon from '@mui/icons-material/Payment'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Footer from '../components/Footer'

const HomePage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verificarERedirecionar = async () => {
      if (isAuthenticated && user) {
        // Se o usuário está logado, identificar tipo e redirecionar
        if (user.isAdmin) {
          navigate('/admin/dashboard', { replace: true })
          return
        }
        
        try {
          // Verificar se é passageiro ou marinheiro
          const response = await axios.get('http://localhost:8080/api/usuario/tipo', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          
          const tipoUsuario = response.data.tipoUsuario
          if (tipoUsuario === 'MARINHEIRO') {
            navigate('/marinheiro/dashboard', { replace: true })
          } else if (tipoUsuario === 'PASSAGEIRO') {
            navigate('/passageiro/dashboard', { replace: true })
          } else {
            setLoading(false)
          }
        } catch (error) {
          console.error('Erro ao verificar tipo de usuário:', error)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    
    verificarERedirecionar()
  }, [isAuthenticated, user, navigate])

  if (loading && isAuthenticated) {
    return null // Ou um loading spinner
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <DirectionsBoatIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            NautiGo
          </Typography>
          {isAuthenticated ? (
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Olá, {user?.nome}
              </Typography>
              <Button color="inherit" onClick={logout} sx={{ textTransform: 'none' }}>
                Sair
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate('/login')} 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              Entrar
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 50%, #00acc1 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <WavesIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              NautiGo
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontWeight: 300,
                fontSize: { xs: '1.25rem', md: '1.75rem' },
              }}
            >
              Plataforma de Transporte Aquático
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.9, fontSize: '1.1rem' }}>
              Conectamos passageiros a marinheiros qualificados para viagens seguras e confiáveis em rios, mares e canais.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ background: '#ffffff', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ textAlign: 'center', mb: 6, color: 'text.primary', fontWeight: 600 }}
          >
            Como deseja usar o NautiGo?
          </Typography>

          <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                border: '2px solid transparent',
                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #0d47a1, #00acc1) border-box',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(13, 71, 161, 0.25)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
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
                  <PersonIcon sx={{ fontSize: 50, color: 'white' }} />
                </Box>
                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Sou Passageiro
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flex: 1, fontSize: '1.1rem' }}>
                  Solicite viagens de barco de forma rápida, segura e com preços transparentes. Encontre marinheiros
                  qualificados próximos a você.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/passageiro/cadastro')}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                    }}
                  >
                    Cadastrar como Passageiro
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      borderColor: '#0d47a1',
                      color: '#0d47a1',
                      '&:hover': {
                        borderColor: '#1565c0',
                        background: 'rgba(13, 71, 161, 0.04)',
                      },
                    }}
                  >
                    Já tenho conta
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                border: '2px solid transparent',
                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #00acc1, #0277bd) border-box',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 172, 193, 0.25)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
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
                  <DirectionsBoatIcon sx={{ fontSize: 50, color: 'white' }} />
                </Box>
                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Sou Marinheiro
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flex: 1, fontSize: '1.1rem' }}>
                  Ofereça seus serviços de transporte aquático e encontre passageiros. Gerencie suas corridas e
                  aumente sua renda de forma organizada.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/marinheiro/cadastro')}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)',
                      boxShadow: '0 4px 14px 0 rgba(0, 172, 193, 0.39)',
                      '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(0, 172, 193, 0.5)',
                      },
                    }}
                  >
                    Cadastrar como Marinheiro
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      borderColor: '#00acc1',
                      color: '#00acc1',
                      '&:hover': {
                        borderColor: '#26c6da',
                        background: 'rgba(0, 172, 193, 0.04)',
                      },
                    }}
                  >
                    Já tenho conta
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Container>
      </Box>

      <Box sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ textAlign: 'center', mb: 6, color: 'text.primary', fontWeight: 600 }}
          >
            Por que escolher o NautiGo?
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(13, 71, 161, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(13, 71, 161, 0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 35, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Segurança
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Marinheiros verificados e embarcações registradas para sua tranquilidade
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(13, 71, 161, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(13, 71, 161, 0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 35, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Rapidez
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Solicite viagens em minutos e encontre marinheiros próximos rapidamente
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(13, 71, 161, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(13, 71, 161, 0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <VerifiedUserIcon sx={{ fontSize: 35, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Confiabilidade
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sistema de avaliações e histórico para garantir a melhor experiência
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid rgba(13, 71, 161, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(13, 71, 161, 0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <PaymentIcon sx={{ fontSize: 35, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Pagamento Digital
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pague de forma segura com cartão, PIX ou dinheiro
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      </Box>
      <Footer />
    </Box>
  )
}

export default HomePage
