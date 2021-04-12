import { cleanup, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AgentProvisionConfig,
  AgentStatus,
  AgentStatusResponse,
  ComponentId,
  ConfigData,
  ConfigureResponse,
  HttpLocation,
  ObsMode,
  ObsModesDetailsResponse,
  Prefix,
  ProvisionConfig
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { Infrastructure } from '../../../src/containers/infrastructure/Infrastructure'
import { SMContextProvider } from '../../../src/contexts/SMContext'
import {
  PROVISION_CONF_PATH,
  SM_CONNECTION
} from '../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../utils/test-utils'
const obsModeDetails: ObsModesDetailsResponse = {
  _type: 'Success',
  obsModes: [
    {
      obsMode: new ObsMode('ESW_DARKNIGHT'),
      resources: ['ESW', 'TCS', 'WFOS'],
      status: {
        _type: 'Configurable'
      },
      sequencers: ['ESW', 'TCS', 'WFOS']
    }
  ]
}

const agentStatus: AgentStatus = {
  agentId: new ComponentId(new Prefix('APS', 'jdks'), 'Machine'),
  seqCompsStatus: [
    {
      seqCompId: new ComponentId(
        new Prefix('ESW', 'DARKNIGHT'),
        'SequenceComponent'
      ),
      sequencerLocation: []
    }
  ]
}

const smLocation: HttpLocation = {
  _type: 'HttpLocation',
  connection: SM_CONNECTION,
  uri: 'url',
  metadata: { prefix: 'ESW.primary' }
}

const successResponse: ConfigureResponse = {
  _type: 'Success',
  masterSequencerComponentId: new ComponentId(
    Prefix.fromString('ESW.primary'),
    'Sequencer'
  )
}

describe('Infrastructure page', () => {
  afterEach(() => {
    cleanup()
  })
  const mockServices = getMockServices()
  const agentService = mockServices.mock.agentService
  const locationService = mockServices.mock.locationService
  when(locationService.track(SM_CONNECTION)).thenReturn(() => {
    return { cancel: () => ({}) }
  })
  it('should render infrastructure page | ESW-442', async () => {
    renderWithAuth({
      ui: <Infrastructure />,
      mockClients: mockServices.serviceFactoryContext
    })
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [],
      seqCompsWithoutAgent: []
    })
    const subtitle = screen.getByText('Sequence Manager')
    const header = screen.getByText('Manage Infrastructure')
    const provision = await screen.findByRole('button', { name: 'Provision' })
    const configure = await screen.findByRole('button', { name: 'Configure' })

    expect(subtitle).to.exist
    expect(header).to.exist
    expect(provision).to.exist
    expect(configure).to.exist
    verify(agentService.getAgentStatus()).called()
  })

  it('should render service down status if sequence manager is not spawned | ESW-442', async () => {
    renderWithAuth({
      ui: (
        <SMContextProvider defaultValue={[undefined, false]}>
          <Infrastructure />
        </SMContextProvider>
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    expect(screen.queryByText('Loading...')).to.not.exist

    await screen.findByText('Service down')
  })

  it('should render running status with agent machine if sequence manager is running on an agent | ESW-442', async () => {
    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: { agentPrefix: 'ESW.primary' }
    }

    renderWithAuth({
      ui: (
        <SMContextProvider defaultValue={[smLocation, false]}>
          <Infrastructure />
        </SMContextProvider>
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('Running on ESW.primary')
  })

  it('should render running on unknown status if sequence manager is running standalone(not on agent) | ESW-442', async () => {
    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: {}
    }

    renderWithAuth({
      ui: (
        <SMContextProvider defaultValue={[smLocation, false]}>
          <Infrastructure />
        </SMContextProvider>
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('Running on unknown')
  })

  it('should refetch agent cards after configure success | ESW-443', async () => {
    const smService = mockServices.mock.smService
    const agentService = mockServices.mock.agentService

    const darkNight = new ObsMode('ESW_DARKNIGHT')

    const agentStatusSuccess: AgentStatusResponse = {
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    }
    when(smService.getObsModesDetails()).thenResolve(obsModeDetails)
    when(smService.configure(deepEqual(darkNight))).thenResolve(successResponse)
    when(agentService.getAgentStatus()).thenResolve(agentStatusSuccess)
    renderWithAuth({
      ui: (
        <SMContextProvider defaultValue={[smLocation, false]}>
          <Infrastructure />
        </SMContextProvider>
      ),
      mockClients: mockServices.serviceFactoryContext
    })
    const button = await screen.findByRole('button', { name: 'Configure' })
    userEvent.click(button, { button: 1 })

    //verify only configurable obsmodes are shown in the list
    const dialog = await screen.findByRole('dialog', {
      name: 'Select an Observation Mode to configure:'
    })

    const darkNightObsMode = await screen.findByRole('menuitem', {
      name: 'ESW_DARKNIGHT'
    })

    //select item by clicking on it
    userEvent.click(darkNightObsMode)
    // wait for button to be enabled.
    await waitFor(() => {
      const configureButton = within(dialog).getByRole('button', {
        name: 'Configure'
      }) as HTMLButtonElement
      expect(configureButton.disabled).false
      userEvent.click(configureButton)
    })

    verify(smService.getObsModesDetails()).called()

    verify(smService.configure(deepEqual(darkNight))).called()
    expect(await screen.findByText('ESW_DARKNIGHT has been configured.')).to
      .exist
    verify(agentService.getAgentStatus()).called()
    expect(screen.queryByRole('ESW_DARKNIGHT has been configured.')).to.null
  })

  it('should refetch agent cards after provision success | ESW-443', async () => {
    const smService = mockServices.mock.smService
    const configService = mockServices.mock.configService
    const agentService = mockServices.mock.agentService

    const eswPrefixStr = 'ESW.machine1'
    const tcsPrefixStr = 'TCS.machine1'

    const confData: Record<string, number> = {
      [eswPrefixStr]: 2,
      [tcsPrefixStr]: 2
    }

    const provisionConfig = new ProvisionConfig(
      Object.entries(confData).map(([pStr, num]) => {
        return new AgentProvisionConfig(Prefix.fromString(pStr), num)
      })
    )
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [],
      seqCompsWithoutAgent: []
    })
    when(configService.getActive(PROVISION_CONF_PATH)).thenResolve(
      ConfigData.fromString(JSON.stringify(confData))
    )

    when(smService.provision(deepEqual(provisionConfig))).thenResolve({
      _type: 'Success'
    })
    renderWithAuth({
      ui: (
        <SMContextProvider defaultValue={[smLocation, false]}>
          <Infrastructure />
        </SMContextProvider>
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const provisionButton = (await screen.findByRole('button', {
      name: 'Provision'
    })) as HTMLButtonElement

    await waitFor(() => expect(provisionButton.disabled).false)

    //User clicks provision button
    userEvent.click(provisionButton)

    const document = await screen.findByRole('document')
    const confirmButton = within(document).getByRole('button', {
      name: 'Provision'
    })

    userEvent.click(confirmButton)

    await screen.findByText('Successfully provisioned')

    verify(smService.provision(deepEqual(provisionConfig))).called()
    verify(agentService.getAgentStatus()).called()
  })
})
