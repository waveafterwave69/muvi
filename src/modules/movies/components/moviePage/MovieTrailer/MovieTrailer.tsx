'use client'

import { useMemo, useState, type FC } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { FullMovieDetail, MovieVideo } from '@/modules/movies/api/moviePage/types'
import styles from './MovieTrailer.module.scss'

interface MovieTrailerProps {
  movie: FullMovieDetail
}

const getTrailer = (videos: MovieVideo[]): MovieVideo | undefined => {
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube')

  return (
    youtubeVideos.find((video) => video.type === 'Trailer' && video.official) ??
    youtubeVideos.find((video) => video.type === 'Trailer') ??
    youtubeVideos.find((video) => video.official) ??
    youtubeVideos[0]
  )
}

const MovieTrailer: FC<MovieTrailerProps> = ({ movie }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const trailer = useMemo(() => getTrailer(movie.videos?.results ?? []), [movie.videos?.results])

  if (!trailer) return null

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null
  const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`
  const embedUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`

  return (
    <section className={styles.trailer} aria-labelledby="movie-trailer-title">
      <div className={styles.header}>
        <div>
          <h3 id="movie-trailer-title" className={styles.title}>
            Трейлер
          </h3>
          <p className={styles.subtitle}>
            {trailer.official ? 'Официальный трейлер' : 'Трейлер'} · YouTube
          </p>
        </div>
      </div>

      <div className={styles.player}>
        {isPlaying ? (
          <iframe
            className={styles.iframe}
            src={embedUrl}
            title={`${trailer.name} — ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {backdropUrl ? (
              <Image
                src={backdropUrl}
                alt=""
                fill
                priority={false}
                sizes="(max-width: 768px) 100vw, 1200px"
                className={styles.backdrop}
              />
            ) : (
              <div className={styles.backdropFallback} />
            )}

            <div className={styles.overlay} />

            <button
              type="button"
              className={styles.playButton}
              aria-label={`Воспроизвести трейлер «${trailer.name}»`}
              onClick={() => setIsPlaying(true)}
            >
              <Play aria-hidden="true" fill="currentColor" />
            </button>

            <div className={styles.videoInfo}>
              <h3>{trailer.name}</h3>
              <p>
                {movie.title} · {trailer.size ? `${trailer.size}p` : 'YouTube'}
              </p>
            </div>

            <a href={youtubeUrl} target="_blank" rel="noreferrer" className={styles.youtubeBadge}>
              YouTube
            </a>
          </>
        )}
      </div>
    </section>
  )
}

export default MovieTrailer
