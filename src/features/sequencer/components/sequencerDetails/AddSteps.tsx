import { PlusCircleOutlined } from '@ant-design/icons'
import {
  GenericResponse,
  Sequence,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import type { Prefix } from '@tmtsoftware/esw-ts/lib/src'
import { Upload } from 'antd'
import React, { useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import {
  cannotOperateOnAnInFlightOrFinishedStepMsg,
  idDoesNotExistMsg
} from '../sequencerResponsesMapping'
import styles from './sequencerDetails.module.css'

const handleResponse = (res: GenericResponse) => {
  switch (res._type) {
    case 'Ok':
      return res

    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error(cannotOperateOnAnInFlightOrFinishedStepMsg)

    case 'IdDoesNotExist':
      throw new Error(idDoesNotExistMsg(res.id))

    case 'Unhandled':
      throw new Error(res.msg)
  }
}

const addSteps =
  (id: string, commands: SequenceCommand[]) =>
  (sequencerService: SequencerService) =>
    sequencerService.insertAfter(id, commands).then(handleResponse)

type AddStepsProps = {
  disabled: boolean
  stepId: string
  sequencerPrefix: Prefix
}

export const AddSteps = ({
  disabled,
  stepId,
  sequencerPrefix
}: AddStepsProps): JSX.Element => {
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const sequencerService = useSequencerService(sequencerPrefix)

  const addStepAction = useMutation({
    mutationFn: addSteps(stepId, commands),
    onError: (e) => errorMessage('Failed to add steps', e),
    onSuccess: () => successMessage('Successfully added steps'),
    invalidateKeysOnSuccess: [[GET_SEQUENCE.key, sequencerPrefix.toJSON()]]
  })

  const beforeUpload = (file: File): Promise<void> =>
    new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCommands(Sequence.fromString(reader.result).commands)
          resolve()
        }
      }
    })

  return (
    <Upload
      disabled={disabled}
      beforeUpload={beforeUpload}
      customRequest={() =>
        sequencerService && addStepAction.mutate(sequencerService)
      }>
      <div className={disabled ? styles.disabled : undefined}>
        <PlusCircleOutlined />
        Add steps
      </div>
    </Upload>
  )
}