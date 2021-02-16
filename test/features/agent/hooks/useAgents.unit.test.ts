import { expect } from 'chai'
import { renderHook } from '@testing-library/react-hooks/dom'
import {
  getContextWithQueryClientProvider,
  getMockServices
} from '../../../utils/test-utils'
import { verify, when } from 'ts-mockito'
import { useAgents } from '../../../../src/features/agent/hooks/useAgents'
import { HttpConnection, HttpLocation, Prefix } from '@tmtsoftware/esw-ts'

describe('useAgents', () => {
  it('should return list of agents up and running | ESW-441', async () => {
    const mockServices = getMockServices()
    const locationService = mockServices.mock.locationService
    const ContextAndQueryClientProvider = getContextWithQueryClientProvider(
      true,
      mockServices.serviceFactoryContext
    )
    const agentPrefix = new Prefix('ESW', 'ESW.Machine1')
    const agentLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: HttpConnection(agentPrefix, 'Service'),
      uri: 'url',
      metadata: {}
    }

    when(locationService.listByComponentType('Machine')).thenResolve([
      agentLocation
    ])

    const { result, waitFor } = renderHook(() => useAgents(), {
      wrapper: ContextAndQueryClientProvider
    })

    await waitFor(() => {
      return result.current.isSuccess
    })

    verify(locationService.listByComponentType('Machine')).called()
    // @ts-ignore
    expect(result.current.data[0]).to.eq(agentPrefix)
  })
})