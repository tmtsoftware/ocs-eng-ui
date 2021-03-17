import type { ObsMode, SequenceManagerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { OBS_MODES_DETAILS } from '../../../queryKeys'
import { useSMService } from '../../../sm/hooks/useSMService'

const shutdown = (obsMode: ObsMode) => async (
  smService: SequenceManagerService
) => {
  const res = await smService.shutdownObsModeSequencers(obsMode)
  switch (res._type) {
    case 'Success':
      return res
    case 'LocationServiceError':
      throw new Error(res.reason)
    case 'Unhandled':
      throw new Error(res.msg)
  }
}

const ShutdownButton = ({ obsMode }: { obsMode: ObsMode }): JSX.Element => {
  const smService = useSMService(false)

  const shutdownAction = useMutation({
    mutationFn: shutdown(obsMode),
    onSuccess: () => successMessage('Successfully shutdown sequencer'),
    onError: (e) => errorMessage('Failed to shutdown sequencer', e),
    invalidateKeysOnSuccess: [OBS_MODES_DETAILS.key]
  })

  return (
    <Button
      disabled={smService.isLoading || smService.isError}
      loading={shutdownAction.isLoading}
      onClick={() =>
        smService.data && shutdownAction.mutateAsync(smService.data)
      }
      danger>
      Shutdown
    </Button>
  )
}

export default ShutdownButton
