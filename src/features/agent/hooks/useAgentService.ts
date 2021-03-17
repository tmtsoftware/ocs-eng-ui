import type { AgentService } from '@tmtsoftware/esw-ts'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { AGENT_SERVICE } from '../../queryKeys'

export const useAgentService = (): UseQueryResult<AgentService> => {
  const { agentServiceFactory } = useServiceFactory()
  return useQuery(AGENT_SERVICE.key, agentServiceFactory, {
    useErrorBoundary: true,
    retry: AGENT_SERVICE.retry
  })
}
