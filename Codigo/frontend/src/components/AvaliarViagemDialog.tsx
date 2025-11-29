import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Rating,
  Alert
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import axios from 'axios'

interface AvaliarViagemDialogProps {
  open: boolean
  onClose: () => void
  viagemId: number
  avaliadoNome: string
  onAvaliacaoConcluida: () => void
}

const AvaliarViagemDialog = ({
  open,
  onClose,
  viagemId,
  avaliadoNome,
  onAvaliacaoConcluida
}: AvaliarViagemDialogProps) => {
  const [nota, setNota] = useState<number>(5)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async () => {
    if (nota < 0 || nota > 5) {
      setErro('A nota deve ser entre 0 e 5')
      return
    }

    try {
      setLoading(true)
      setErro('')
      await axios.post(
        `http://localhost:8080/api/avaliacoes/viagens/${viagemId}`,
        {
          nota,
          comentario: comentario.trim() || null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      onAvaliacaoConcluida()
      handleCloseInternal()
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao avaliar viagem')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseInternal = () => {
    setNota(5)
    setComentario('')
    setErro('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseInternal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 2 }}>
        Avaliar Viagem
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Como foi sua experiência com <strong>{avaliadoNome}</strong>?
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Nota:
            </Typography>
            <Rating
              value={nota}
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  setNota(newValue)
                }
              }}
              max={5}
              size="large"
              icon={<StarIcon sx={{ fontSize: 40 }} />}
              emptyIcon={<StarIcon sx={{ fontSize: 40, opacity: 0.3 }} />}
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#ffc107',
                },
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {nota}/5
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Comentário (opcional)"
            multiline
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Deixe um comentário sobre sua experiência..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {erro}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={() => {
            onAvaliacaoConcluida()
            handleCloseInternal()
          }}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Pular
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: 'none',
            background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
          }}
        >
          {loading ? 'Avaliando...' : 'Enviar Avaliação'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AvaliarViagemDialog

