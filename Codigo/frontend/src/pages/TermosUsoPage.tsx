import { Container, Box, Typography, Paper, AppBar, Toolbar, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

const TermosUsoPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [tipoUsuario, setTipoUsuario] = useState<string>('')

  useEffect(() => {
    const verificarTipoUsuario = async () => {
      if (!isAuthenticated || !user) {
        return
      }
      
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
  }, [isAuthenticated, user])

  const getRotaRetorno = () => {
    if (!isAuthenticated || !user) {
      return '/'
    }
    
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
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4, color: 'primary.main' }}>
            Termos de Uso
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              1. Aceitação dos Termos
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Ao acessar e usar a plataforma NautiGo, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              2. Descrição do Serviço
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              O NautiGo é uma plataforma que conecta passageiros e marinheiros para serviços de transporte aquático. 
              A plataforma facilita a comunicação entre usuários, mas não é responsável pela execução dos serviços de transporte.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              3. Cadastro e Conta de Usuário
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Para usar o NautiGo, você deve criar uma conta fornecendo informações precisas e atualizadas. 
              Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades 
              que ocorrem em sua conta. Marinheiros devem passar por processo de aprovação antes de poderem aceitar viagens.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              4. Responsabilidades dos Usuários
            </Typography>
            <Typography variant="body1" component="div" sx={{ textAlign: 'justify' }}>
              <Typography variant="body1" paragraph>
                <strong>Passageiros:</strong>
              </Typography>
              <Typography variant="body1" component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>Fornecer informações precisas sobre origem, destino e número de passageiros</li>
                <li>Comparecer no local e horário acordados</li>
                <li>Realizar o pagamento conforme o método escolhido</li>
                <li>Tratar os marinheiros com respeito e cortesia</li>
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Marinheiros:</strong>
              </Typography>
              <Typography variant="body1" component="ul" sx={{ pl: 3, mb: 2 }}>
                <li>Possuir documentação válida e embarcação adequada</li>
                <li>Fornecer serviços de transporte seguros e profissionais</li>
                <li>Respeitar os horários e locais acordados</li>
                <li>Manter a embarcação em condições adequadas de uso</li>
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              5. Pagamentos
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Os pagamentos são realizados diretamente entre passageiro e marinheiro, utilizando os métodos acordados 
              (dinheiro ou PIX). O NautiGo não processa pagamentos e não se responsabiliza por transações financeiras 
              entre usuários.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              6. Cancelamentos
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Passageiros e marinheiros podem cancelar viagens antes do início da mesma. Cancelamentos após o início 
              da viagem podem estar sujeitos a penalidades conforme acordado entre as partes.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              7. Limitação de Responsabilidade
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              O NautiGo atua como intermediário entre passageiros e marinheiros. Não somos responsáveis por acidentes, 
              danos, perdas ou lesões que possam ocorrer durante o uso do serviço de transporte. A responsabilidade 
              pelo serviço de transporte é exclusiva do marinheiro e do passageiro.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              8. Modificações dos Termos
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Reservamos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas 
              serão comunicadas aos usuários. O uso continuado da plataforma após as modificações constitui aceitação 
              dos novos termos.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              9. Contato
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Para questões sobre estes Termos de Uso, entre em contato conosco através do email: suporte@nautigo.com
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  )
}

export default TermosUsoPage

