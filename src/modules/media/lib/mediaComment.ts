export const MEDIA_COMMENT_MAX_LENGTH = 80

export const normalizeMediaComment = (comment?: string | null): string | null => {
  const normalizedComment = comment?.trim().slice(0, MEDIA_COMMENT_MAX_LENGTH)

  return normalizedComment || null
}

export const formatMediaComment = (comment: string): string => {
  const normalizedComment = comment.trim()

  if (normalizedComment.length <= MEDIA_COMMENT_MAX_LENGTH) {
    return normalizedComment
  }

  return `${normalizedComment.slice(0, MEDIA_COMMENT_MAX_LENGTH - 1).trimEnd()}…`
}
