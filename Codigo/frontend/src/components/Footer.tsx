import { Box, Container, Typography, Grid, Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #0d47a1 0%, #0277bd 100%)',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DirectionsBoatIcon sx={{ mr: 1, fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                NautiGo
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Conectando passageiros e marinheiros para uma experiência de transporte aquático segura e confiável.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Suporte
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>


              <MuiLink
                component={Link}
                to="/termos-uso"
                color="inherit"
                underline="hover"
                sx={{
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                Termos de Uso
              </MuiLink>
              <MuiLink
                component={Link}
                to="/politica-privacidade"
                color="inherit"
                underline="hover"
                sx={{
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                Política de Privacidade
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contato
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Email: suporte@nautigo.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Horário: Segunda a Sexta, 9h às 18h
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} NautiGo. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

