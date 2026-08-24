import { MediaIdentity } from './types'

export const getMediaHref = ({ id, type }: MediaIdentity): string => `/media/${type}/${id}`
