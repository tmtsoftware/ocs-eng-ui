import { screen, waitFor } from '@testing-library/react'
import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { HttpConnection, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { SMCard } from '../../../../src/features/sm/components/smcard/SMCard'
import { SM_CONNECTION } from '../../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

describe('SMCard', () => {
  it('should show Spawn button if Sequence Manager is not spawned | ESW-441', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService
    const agentPrefix = new Prefix('ESW', 'ESW.Machine1')
    const agentLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: HttpConnection(agentPrefix, 'Service'),
      uri: 'url',
      metadata: {}
    }

    when(locationServiceMock.listByComponentType('Machine')).thenResolve([
      agentLocation
    ])
    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(undefined)

    renderWithAuth({
      ui: <SMCard />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })

    await waitFor(
      () => expect(screen.queryByRole('button', { name: 'Shutdown' })).to.null
    )

    await screen.findByRole('button', { name: 'Spawn' })

    verify(locationServiceMock.find(SM_CONNECTION)).called()
  })

  it('should show Shutdown button if Sequence Manager is already spawned | ESW-441', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService
    const agentPrefix = new Prefix('ESW', 'ESW.Machine1')
    const agentLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: HttpConnection(agentPrefix, 'Service'),
      uri: 'url',
      metadata: {}
    }

    when(locationServiceMock.listByComponentType('Machine')).thenResolve([
      agentLocation
    ])
    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: {}
    }
    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(smLocation)

    renderWithAuth({
      ui: <SMCard />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })

    await waitFor(
      () => expect(screen.queryByRole('button', { name: 'Spawn' })).to.null
    )

    await screen.findByRole('button', { name: 'Shutdown' })
    verify(locationServiceMock.find(SM_CONNECTION)).called()
  })
})