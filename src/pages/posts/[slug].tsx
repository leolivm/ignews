/* eslint-disable testing-library/no-await-sync-query */
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { RichText } from 'prismic-dom'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { getSession } from 'next-auth/client'
import getPrismicClient from '../../services/prismic'
import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
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
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req })
  const { slug } = params

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const prismic = getPrismicClient(req)
  const response = await prismic.getByUID('post', String(slug), {})
  const post = {
    slug,
    title: response?.data.title ? RichText.asText(response?.data.title) : '',
    content: response?.data.content
      ? RichText.asHtml(response?.data.content)
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
  }
}
