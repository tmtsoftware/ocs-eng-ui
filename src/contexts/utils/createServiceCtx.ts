import type {
  Location,
  Connection,
  TokenFactory,
  TrackingEvent
} from '@tmtsoftware/esw-ts'
import { useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useStream } from '../../hooks/useStream'
import { createTokenFactory } from '../../utils/createTokenFactory'
import { useLocationService } from '../LocationServiceContext'
import { createCtx, CtxType } from './createCtx'

export const createServiceCtx = <T>(
  connection: Connection,
  factory: (location: Location, tokenFactory: TokenFactory) => T
): CtxType<[T | undefined, boolean]> => {
  const useHook = () => useService(connection, factory)

  return createCtx(useHook)
}

export const useService = <T>(
  connection: Connection,
  factory: (location: Location, tokenFactory: TokenFactory) => T
): [T | undefined, boolean] => {
  const { auth } = useAuth()
  const locationService = useLocationService()
  const onEventCallback = useCallback(
    (event: TrackingEvent) => {
      if (event._type === 'LocationRemoved') return undefined

      return factory(event.location, createTokenFactory(auth))
    },
    [auth, factory]
  )

  const track = useCallback(
    (onEvent) => locationService.track(connection)(onEvent),
    [connection, locationService]
  )

  return useStream({
    mapper: onEventCallback,
    run: track
  })
}