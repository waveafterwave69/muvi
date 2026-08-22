import { supabase } from '@/shared/api/supabase'
import type {
  CoupleInvitePreview,
  CoupleInviteResponse,
  CoupleMediaFilters,
  CoupleMediaItem,
  CoupleMediaResponse,
  CouplePageData,
} from './types'


export const getCouplePageData = async (): Promise<CouplePageData> => {
  const { data, error } = await supabase.rpc('get_couple_page_data')

  if (error) throw error

  const pageData = data as CouplePageData

  if (!pageData) {
    throw new Error('Сервер не вернул данные страницы пары')
  }

  return pageData
}

interface GetCoupleMediaParams extends CoupleMediaFilters {
  coupleId: string
  page?: number
  limit?: number
  signal?: AbortSignal
}

export const getCoupleMedia = async ({
  coupleId,
  page = 1,
  limit = 20,
  mediaType,
  status,
  search,
  signal,
}: GetCoupleMediaParams): Promise<CoupleMediaResponse> => {
  const from = (page - 1) * limit
  const to = from + limit - 1
  const normalizedSearch = search.trim()

  let query = supabase
    .from('couple_media')
    .select(
      `
        couple_id,
        media_id,
        status,
        created_at,
        media:media!inner (*)
      `,
      { count: 'exact' },
    )
    .eq('couple_id', coupleId)
    .eq('status', status)
    .eq('media.type', mediaType)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (normalizedSearch) {
    query = query.ilike('media.title', `%${normalizedSearch}%`)
  }

  if (signal) {
    query = query.abortSignal(signal)
  }

  const { data, error, count } = await query.overrideTypes<CoupleMediaItem[], {
    merge: false
  }>()

  if (error) {
    throw new Error(`Не удалось загрузить коллекцию пары: ${error.message}`, {
      cause: error,
    })
  }

  const total = count ?? 0

  return {
    items: data ?? [],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  }
}

export const createCoupleInvite = async (): Promise<void> => {
  const { error } = await supabase.rpc('create_couple_invite')

  if (error) throw error
}

const isCoupleInvitePreview = (value: unknown): value is CoupleInvitePreview => {
  if (!value || typeof value !== 'object') return false

  const invite = value as Partial<CoupleInvitePreview>

  return (
    typeof invite.id === 'string' &&
    (invite.type === 'link' || invite.type === 'direct') &&
    typeof invite.expires_at === 'string' &&
    Boolean(invite.inviter) &&
    typeof invite.inviter?.id === 'string' &&
    typeof invite.inviter?.username === 'string'
  )
}

export const getCoupleInvitePreview = async (
  inviteId: string,
): Promise<CoupleInvitePreview> => {
  const { data, error } = await supabase.rpc('get_couple_invite_preview', {
    p_token: inviteId,
  })

  if (error) throw error

  const response = data as CoupleInvitePreview
  const invite =
    response && typeof response === 'object' && 'invite' in response
      ? (response as { invite?: unknown }).invite
      : response

  if (!isCoupleInvitePreview(invite)) {
    throw new Error('Приглашение недоступно')
  }

  return invite
}

export const cancelCoupleInvite = async (inviteId: string): Promise<void> => {
  const { error } = await supabase.rpc('revoke_couple_invite', {
    p_invite_id: inviteId,
  })

  if (error) throw error
}

export const respondToCoupleInvite = async ({
  inviteId,
  response,
}: {
  inviteId: string
  response: CoupleInviteResponse
}): Promise<void> => {
  const { error } = await supabase.rpc('respond_to_couple_invite', {
    p_invite_id: inviteId,
    p_response: response,
  })

  if (error) throw error
}

export const leaveCouple = async (): Promise<void> => {
  const { error } = await supabase.rpc('leave_couple')

  if (error) throw error
}
