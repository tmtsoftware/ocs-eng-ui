import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Observe,
  OkOrUnhandledResponse,
  Prefix,
  Sequence,
  SequenceCommand,
  SequencerState,
  Setup
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { anything, deepEqual, verify, when } from 'ts-mockito'
import { LoadSequence } from '../../../../../src/features/sequencer/components/actions/LoadSequence'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('LoadSequence', () => {
  const command1: SequenceCommand = new Setup(
    Prefix.fromString('CSW.ncc.trombone'),
    'move',
    [],
    '2020A-001-123'
  )
  const command2: SequenceCommand = new Observe(
    Prefix.fromString('CSW.ncc.trombone'),
    'move',
    [],
    '2020A-001-123'
  )
  const sequence = new Sequence([command1, command2])

  const file = new File([JSON.stringify(sequence)], 'sequence.json')
  const testData: [OkOrUnhandledResponse, string, string][] = [
    [{ _type: 'Ok' }, 'Sequence has been loaded successfully', 'successful'],
    [
      {
        _type: 'Unhandled',
        msg: 'LoadSequence message is not handled in Offline state',
        messageType: 'LoadSequence',
        state: 'Offline'
      },
      'Failed to load the sequence, reason: LoadSequence message is not handled in Offline state',
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-458`, async () => {
      when(sequencerServiceMock.loadSequence(anything())).thenResolve(res)

      renderWithAuth({
        ui: (
          <LoadSequence
            prefix={Prefix.fromString('ESW.darknight')}
            sequencerState={'Idle'}
          />
        )
      })

      const button: HTMLElement[] = screen.getAllByRole('button', {
        name: 'Load Sequence'
      })

      // eslint-disable-next-line testing-library/no-node-access
      const input: HTMLInputElement = button[0].querySelector(
        'input'
      ) as HTMLInputElement

      expect(input.type).equal('file')
      expect(input.style.display).equal('none')

      userEvent.upload(input, file)

      await screen.findByText(msg)

      await waitFor(() =>
        verify(
          sequencerServiceMock.loadSequence(deepEqual(sequence.commands))
        ).called()
      )
    })
  })

  it.only('should show failed if error is returned | ESW-458', async () => {
    when(sequencerServiceMock.loadSequence(anything())).thenReject(
      Error('error occurred')
    )

    renderWithAuth({
      ui: (
        <LoadSequence
          prefix={Prefix.fromString('ESW.darknight')}
          sequencerState={'Idle'}
        />
      )
    })

    const button: HTMLElement[] = screen.getAllByRole('button', {
      name: 'Load Sequence'
    })

    // eslint-disable-next-line testing-library/no-node-access
    const input: HTMLInputElement = button[0].querySelector(
      'input'
    ) as HTMLInputElement

    userEvent.upload(input, file)

    await screen.findByText(
      'Failed to load the sequence, reason: error occurred'
    )

    await waitFor(() =>
      verify(
        sequencerServiceMock.loadSequence(deepEqual(sequence.commands))
      ).called()
    )
  })

  const disabledStates: (SequencerState['_type'] | undefined)[] = [
    undefined,
    'Processing',
    'Offline',
    'Running'
  ]

  disabledStates.forEach((state) => {
    it(`should be disabled if sequencer in ${state} | ESW-458`, async () => {
      renderWithAuth({
        ui: (
          <LoadSequence
            prefix={Prefix.fromString('ESW.darknight')}
            sequencerState={state}
          />
        )
      })

      const loadButton = screen.getByRole('LoadSequence') as HTMLButtonElement

      expect(loadButton.disabled).to.be.true
    })
  })
})
