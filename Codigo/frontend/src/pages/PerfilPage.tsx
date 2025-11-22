import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Rating,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StarIcon from '@mui/icons-material/Star'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import axios from 'axios'
import Footer from '../components/Footer'

const PerfilPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notaMedia, setNotaMedia] = useState<number>(5.0)
  const [quantidadeAvaliacoes, setQuantidadeAvaliacoes] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    carregarNotaMedia()
  }, [user, navigate])

  const carregarNotaMedia = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:8080/api/avaliacoes/usuario/${user.id}/media`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setNotaMedia(response.data.notaMedia || 5.0)
      setQuantidadeAvaliacoes(response.data.quantidadeAvaliacoes || 0)
    } catch (error) {
      console.error('Erro ao carregar nota média:', error)
      setNotaMedia(5.0)
    } finally {
      setLoading(false)
    }
  }

  const [tipoUsuario, setTipoUsuario] = useState<string>('')

  useEffect(() => {
    const verificarTipoUsuario = async () => {
      if (!user) return
      
      if (user.isAdmin) {
        setTipoUsuario('ADMIN')
        return
      }

      try {
        const response = await axios.get('http://localhost:8080/api/usuario/tipo', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setTipoUsuario(response.data.tipoUsuario)
      } catch (error) {
        console.error('Erro ao verificar tipo de usuário:', error)
      }
    }

    verificarTipoUsuario()
  }, [user])

  // Determinar rota de retorno baseado no tipo de usuário
  const getRotaRetorno = () => {
    if (tipoUsuario === 'ADMIN') {
      return '/admin/dashboard'
    } else if (tipoUsuario === 'MARINHEIRO') {
      return '/marinheiro/dashboard'
    } else if (tipoUsuario === 'PASSAGEIRO') {
      return '/passageiro/dashboard'
    }
    return '/'
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(getRotaRetorno())} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <DirectionsBoatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            NautiGo
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Informações da Conta
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                      boxShadow: '0 8px 24px rgba(13, 71, 161, 0.3)',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {user?.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Dados Pessoais
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Nome
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user?.nome}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Avaliações
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Rating
                      value={notaMedia}
                      readOnly
                      precision={0.1}
                      icon={<StarIcon sx={{ fontSize: 28 }} />}
                      emptyIcon={<StarIcon sx={{ fontSize: 28, opacity: 0.3 }} />}
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#ffc107',
                        },
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {notaMedia.toFixed(1)} / 5.0
                    </Typography>
                    {quantidadeAvaliacoes > 0 && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ({quantidadeAvaliacoes} {quantidadeAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
                      </Typography>
                    )}
                    {quantidadeAvaliacoes === 0 && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        (Sem avaliações ainda)
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default PerfilPage

