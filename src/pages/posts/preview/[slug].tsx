/* eslint-disable testing-library/no-await-sync-query */
import { useEffect } from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { RichText } from 'prismic-dom'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import getPrismicClient from '../../../services/prismic'
import styles from '../post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession()
  const { push } = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      push(`/posts/${post.slug}`)
    }
  }, [post.slug, push, session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient()
  const response = await prismic.getByUID('post', String(slug), {})
  const post = {
    slug,
    title: response?.data.title ? RichText.asText(response?.data.title) : '',
    content: response?.data.content
      ? RichText.asHtml(response?.data.content.splice(0, 3))
      : '',
    updatedAt: response?.last_publication_date
      ? format(
          new Date(response.last_publication_date),
          "dd 'de' MMMM 'de' yyyy",
          { locale: ptBR }
        )
      : '',
  }

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  }
}
