import { PlusCircleOutlined } from '@ant-design/icons'
import { AgentService, Prefix } from '@tmtsoftware/esw-ts'
import { Button, Input, Popconfirm, Tooltip } from 'antd'
import React, { useState } from 'react'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import styles from './agentCards.module.css'

const spawnSequenceComponent = (agentPrefix: Prefix, componentName: string) => (
  agentService: AgentService
) =>
  agentService
    .spawnSequenceComponent(agentPrefix, componentName)
    .then((res) => {
      if (res._type === 'Failed') throw new Error(res.msg)
      return res
    })

const requirement = (predicate: boolean, msg: string) =>
  predicate && errorMessage(msg)

const validateComponentName = (componentName: string) => {
  requirement(
    componentName !== componentName.trim(),
    'component name has leading and trailing whitespaces'
  )
  requirement(componentName.includes('-'), "component name has '-'")
}

export const SpawnSequenceComponent = ({
  agentPrefix
}: {
  agentPrefix: Prefix
}): JSX.Element => {
  const [componentName, setComponentName] = useState('')

  const [agentService] = useAgentService()

  const spawnSequenceComponentAction = useMutation({
    mutationFn: spawnSequenceComponent(agentPrefix, componentName),
    onSuccess: () =>
      successMessage(
        `Successfully spawned Sequence Component: ${new Prefix(
          agentPrefix.subsystem,
          componentName
        ).toJSON()}`
      ),
    onError: (e) => errorMessage('Sequence Component could not be spawned', e),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key],
    useErrorBoundary: false
  })

  const resetComponentName = () => setComponentName('')

  const onConfirm = () => {
    validateComponentName(componentName)
    agentService && spawnSequenceComponentAction.mutateAsync(agentService)
    resetComponentName()
  }
  return (
    <Tooltip placement='bottom' title='Add sequence component'>
      <Popconfirm
        title={
          <>
            Component name:
            <Input
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
            />
          </>
        }
        icon={<></>}
        onCancel={resetComponentName}
        onConfirm={onConfirm}
        disabled={spawnSequenceComponentAction.isLoading}>
        <Button
          type='text'
          icon={
            <PlusCircleOutlined
              className={styles.commonIcon}
              role='addSeqCompIcon'
            />
          }
          loading={spawnSequenceComponentAction.isLoading}
        />
      </Popconfirm>
    </Tooltip>
  )
}
