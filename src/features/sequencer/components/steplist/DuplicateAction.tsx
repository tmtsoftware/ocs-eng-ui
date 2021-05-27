import { CopyOutlined } from '@ant-design/icons'
import { Button, Row, Space } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { Prefix, SequenceCommand, SequencerService } from '@tmtsoftware/esw-ts'

const addCommands = (commands: SequenceCommand[]) => (sequencerService: SequencerService) => {
  return sequencerService.add(commands).then((res) => {
    switch (res._type) {
      case 'Ok':
        return res

      case 'Unhandled':
        throw new Error(res.msg)
    }
  })
}

export const DuplicateAction = ({
  sequencerPrefix,
  commands: selectedCommands,
  toggleDuplicateEnabled
}: {
  sequencerPrefix: Prefix
  commands: SequenceCommand[]
  toggleDuplicateEnabled: () => void
}): JSX.Element => {
  const sequencerService = useSequencerService(sequencerPrefix)
  const duplicateAction = useMutation({
    mutationFn: addCommands(selectedCommands),
    onError: (e) => errorMessage('Failed to duplicate steps', e),
    onSuccess: () => successMessage('Successfully duplicated steps')
  })

  return (
    <Row justify='end' style={{ padding: '1rem 1rem' }} align='middle'>
      <Space>
        <Button onClick={toggleDuplicateEnabled}>Cancel</Button>
        <Button
          type='primary'
          loading={duplicateAction.isLoading}
          disabled={selectedCommands.length === 0}
          onClick={() => {
            sequencerService && duplicateAction.mutateAsync(sequencerService)
            toggleDuplicateEnabled()
          }}>
          <CopyOutlined />
          Duplicate
        </Button>
      </Space>
    </Row>
  )
}