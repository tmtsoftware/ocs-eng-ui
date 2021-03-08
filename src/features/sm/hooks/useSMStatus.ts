import type { Location, Option } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { SM_STATUS_KEY } from '../../queryKeys'
import { SM_CONNECTION } from '../constants'

export const useSMStatus = (): UseQueryResult<Option<Location>, unknown> => {
  const { locationServiceFactory } = useServiceFactory()
  return useQuery(SM_STATUS_KEY, () =>
    locationServiceFactory().find(SM_CONNECTION)
  )
}
