import { Container, Box, Typography, Paper, AppBar, Toolbar, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

const PoliticaPrivacidadePage = () => {
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
            Política de Privacidade
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              A NautiGo está comprometida em proteger a privacidade e os dados pessoais de nossos usuários. 
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              1. Informações que Coletamos
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Coletamos as seguintes informações quando você se cadastra e usa nossa plataforma:
            </Typography>
            <Typography variant="body1" component="ul" sx={{ pl: 3, mb: 2 }}>
              <li><strong>Dados Pessoais:</strong> Nome, email, telefone</li>
              <li><strong>Dados de Localização:</strong> Origem e destino das viagens solicitadas</li>
              <li><strong>Dados de Navegação:</strong> Informações sobre como você usa a plataforma</li>
              <li><strong>Dados de Marinheiros:</strong> Documentação, informações sobre embarcação e capacidade</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              2. Como Usamos suas Informações
            </Typography>
            <Typography variant="body1" component="ul" sx={{ pl: 3, mb: 2 }}>
              <li>Facilitar a conexão entre passageiros e marinheiros</li>
              <li>Processar e gerenciar solicitações de viagem</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Enviar notificações sobre viagens e atualizações da plataforma</li>
              <li>Garantir a segurança e prevenir fraudes</li>
              <li>Cumprir obrigações legais</li>
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              3. Compartilhamento de Informações
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Compartilhamos suas informações apenas nas seguintes situações:
            </Typography>
            <Typography variant="body1" component="ul" sx={{ pl: 3, mb: 2 }}>
              <li>Com outros usuários da plataforma quando necessário para completar uma viagem (ex: passageiro e marinheiro veem informações básicas um do outro)</li>
              <li>Com autoridades competentes quando exigido por lei</li>
              <li>Para proteger nossos direitos, propriedade ou segurança, ou de nossos usuários</li>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Não vendemos, alugamos ou comercializamos suas informações pessoais para terceiros.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              4. Segurança dos Dados
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra 
              acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, controles de acesso 
              e monitoramento regular de nossos sistemas.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              5. Seus Direitos
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Você tem o direito de:
            </Typography>
            <Typography variant="body1" component="ul" sx={{ pl: 3, mb: 2 }}>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações incorretas ou incompletas</li>
              <li>Solicitar a exclusão de seus dados pessoais</li>
              <li>Revogar seu consentimento para processamento de dados</li>
              <li>Exportar seus dados em formato legível</li>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Para exercer esses direitos, entre em contato conosco através do email: suporte@nautigo.com
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              6. Retenção de Dados
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta 
              política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              7. Cookies e Tecnologias Similares
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma 
              e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do navegador.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              8. Alterações nesta Política
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças 
              significativas através da plataforma ou por email. Recomendamos que revise esta política regularmente.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
              9. Contato
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre como tratamos seus 
              dados pessoais, entre em contato conosco:
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Email:</strong> suporte@nautigo.com
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  )
}

export default PoliticaPrivacidadePage

