import type { Prefix } from '@tmtsoftware/esw-ts'

export const startSequencerConstants = {
  successMessage: 'Successfully started sequencer',
  failureMessage: 'Failed to start sequencer',
  startSequencerButtonText: 'Start Sequencer',
  inputErrorMessage: 'Please input subsystem and observation mode',
  modalTitle: 'Select a Subsystem and Observation Mode to spawn:',
  modalOkText: 'Confirm',
  subsystemInputPlaceholder: 'Select a Subsystem',
  subsystemInputLabel: 'Subsystem',
  obsModeInputLabel: 'Observation Mode',
  obsModeInputPlaceholder: 'Enter Observation Mode',
  getAlreadyRunningErrorMessage: (prefix: string): string => `${prefix} is already running`
}

export const stopSequencerConstants = {
  successMessage: (sequencerPrefix: Prefix): string => `Successfully stopped sequencer ${sequencerPrefix.toJSON()}`,
  failureMessage: (sequencerPrefix: Prefix): string => `Failed to stop sequencer ${sequencerPrefix.toJSON()}`,
  menuItemText: 'Stop Sequencer',
  modalOkButtonText: 'Stop',
  getModalTitle: (sequencerPrefix: string): string => `Are you sure you want to stop sequencer '${sequencerPrefix}'?`
}

export const reloadScriptConstants = {
  getSuccessMessage: (sequencerPrefix: string): string => `Successfully loaded script ${sequencerPrefix}`,
  getFailureMessage: (sequencerPrefix: string): string => `Failed to load script ${sequencerPrefix}`,
  menuItemText: 'Reload Script',
  modalOkButtonText: 'Reload',
  getModalTitle: (subsystem: string, obsMode: string): string =>
    `Do you want to reload the sequencer ${subsystem}.${obsMode}?`
}

export const configureConstants = {
  getSuccessMessage: (obsModeName: string | undefined): string => `${obsModeName} has been configured.`,
  getFailureMessage: (obsModeName: string | undefined): string => `Failed to configure ${obsModeName}`,
  selectObModeMessage: 'Please select observation mode!',
  modalTitle: 'Select an Observation Mode to configure:',
  modalOkText: 'Configure'
}

export const provisionConfConstants = {
  fetchFailureMessage: 'Failed to fetch provision config',
  confEmptyMessage: 'Provision config is empty',
  confNotPresentMessage: 'Provision conf is not present',
  getInValidConfMessage: (agent: string): string =>
    `value of number of sequence components for ${agent} is not an Integer`
}
export const provisionConstants = {
  successMessage: 'Successfully provisioned',
  failureMessage: 'Failed to provision',
  modalOkText: 'Provision'
}

export const unProvisionConstants = {
  successMessage: 'Successfully shutdown all the Sequence Components',
  failureMessage: 'Failed to shutdown all Sequence Components',
  modalTitle: 'Do you want to shutdown all the Sequence Components?',
  modalOkText: 'Shutdown'
}

export const shutdownSMConstants = {
  successMessage: 'Successfully shutdown Sequence Manager',
  failureMessage: 'Failed to shutdown Sequence Manager',
  modalTitle: 'Do you want to shutdown Sequence Manager?',
  modalOkText: 'Shutdown'
}

export const spawnSMConstants = {
  successMessage: 'Successfully spawned Sequence Manager',
  failureMessage: 'Sequence Manager could not be spawned. Please try again.',
  agentNotRunningMessage: 'Agents are not running. Please start an agent first.',
  selectAgentMessage: 'Please select agent!',
  modalTitle: 'Choose an agent to spawn the Sequence Manager',
  modalOkText: 'Spawn'
}
