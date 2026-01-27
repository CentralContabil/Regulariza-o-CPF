import cron from 'node-cron'
import { AutomacaoService } from '@/services/AutomacaoService'

/**
 * Configura e inicia todos os jobs agendados
 */
export function iniciarCronJobs() {
  // Lembretes de IRPF - Todo dia 15 de janeiro às 9h
  cron.schedule('0 9 15 1 *', async () => {
    console.log('Executando lembretes de IRPF...')
    try {
      const resultado = await AutomacaoService.enviarLembretesIRPF()
      console.log(`Lembretes de IRPF: ${resultado.enviados}/${resultado.total}`)
    } catch (error) {
      console.error('Erro ao executar lembretes de IRPF:', error)
    }
  })

  // Follow-up de processos - Toda segunda-feira às 10h
  cron.schedule('0 10 * * 1', async () => {
    console.log('Executando follow-up de processos...')
    try {
      const resultado = await AutomacaoService.followUpProcessos()
      console.log(`Follow-up enviado: ${resultado.enviados}/${resultado.total}`)
    } catch (error) {
      console.error('Erro ao executar follow-up:', error)
    }
  })

  // Verificação de renovação - Todo dia às 8h
  cron.schedule('0 8 * * *', async () => {
    console.log('Verificando renovações de contratos...')
    try {
      const resultado = await AutomacaoService.verificarRenovacaoContratos()
      console.log(`Renovações processadas: ${resultado.notificacoes}/${resultado.total}`)
    } catch (error) {
      console.error('Erro ao verificar renovações:', error)
    }
  })

  // Campanha de retenção - Toda primeira segunda-feira do mês às 11h
  cron.schedule('0 11 1-7 * 1', async () => {
    console.log('Executando campanha de retenção...')
    try {
      const resultado = await AutomacaoService.campanhaRetencao()
      console.log(`Campanha de retenção: ${resultado.enviados}/${resultado.total}`)
    } catch (error) {
      console.error('Erro ao executar campanha de retenção:', error)
    }
  })

  console.log('✅ Cron jobs configurados e iniciados')
}



