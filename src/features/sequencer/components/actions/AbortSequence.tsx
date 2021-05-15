import { Button } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../../components/modal/showConfirmModal'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import type {
  OkOrUnhandledResponse,
  SequencerService
} from '@tmtsoftware/esw-ts'

const useAbortSequence = (): UseMutationResult<
  OkOrUnhandledResponse,
  unknown,
  SequencerService
> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.abortSequence()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Successfully aborted the Sequence')
      return errorMessage('Failed to abort the Sequence', Error(res.msg))
    },
    onError: (e) => errorMessage('Failed to abort the Sequence', e)
  })
}

export const AbortSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const abortAction = useAbortSequence()

  return (
    <Button
      danger
      loading={abortAction.isLoading}
      onClick={() =>
        sequencerService &&
        showConfirmModal(
          () => {
            abortAction.mutate(sequencerService)
          },
          'Do you want to abort the sequence?',
          'Abort'
        )
      }
      disabled={!sequencerState || sequencerState !== 'Running'}>
      Abort sequence
    </Button>
  )
}
