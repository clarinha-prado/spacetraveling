import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi'
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [urlNextPage, setUrlNextPage] = useState("");

  useEffect(() => {
    setPosts(props.postsPagination.results.slice());
    setUrlNextPage(props.postsPagination.next_page);
  }, []);

  function handleClick() {
    if (!urlNextPage) {
      return;
    }

    const response = fetch(urlNextPage)
      .then(response => response.json())
      .then(data => {

        setUrlNextPage(data.next_page);

        data.results.map((item) => {
          item.first_publication_date = format(
            new Date(item.first_publication_date),
            "d MMM yyyy",
            {
              locale: ptBR,
            }
          );
        })

        setPosts(data.results);
      });


  }

  return (

    <main className={commonStyles.container}>
      <Header />
      <section>

        {posts.map(post => (
          <article key={post.uid} className={styles.postSummary}>
            <a href={`/post/${post.uid}`}><h1>{post.data.title}</h1>
              <h2>{post.data.subtitle}</h2>
              <p>
                <FiCalendar className={commonStyles.icon} />
                {format(
                  new Date(post.first_publication_date),
                  "d MMM yyyy",
                  {
                    locale: ptBR,
                  }
                )}
                <FiUser className={commonStyles.icon} />
                {post.data.author}
              </p></a>
          </article>
        ))}

        {urlNextPage ? (
          <button
            type="button"
            className={styles.nextPage}
            onClick={() => handleClick()}
          >
            Carregar mais posts
          </button>

        ) : ''}
      </section>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();

  const postResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author', 'post.last_publication_date'],
      pageSize: 2,
      page: 1
    }
  );

  const posts = postResponse.results.map(post => {
    return {
      uid: post.uid,

      first_publication_date: post.first_publication_date,

      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postResponse.next_page,
        results: posts
      }
    },
    revalidate: 60 * 60 * 24 // 1 dia
  }
};
