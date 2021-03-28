import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi'
import Link from 'next/link';

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

export default function Home() {
  return (
    <main className={commonStyles.container}>
      <header>
        <img src="/Logo.svg" alt="logo" />
      </header>
      <section>

        <article className={styles.postSummary}>
          <a href="/post/1">Quem vencerá a corrida?</a>
          <h2>Um exemplo clássico para apresentar o conceito de limite em matemática é a corrida hipotética entre um coelho e uma tartaruga.</h2>
          <p>
            <FiCalendar className={commonStyles.icon} />
            10 de outubro de 2021
            <FiUser className={commonStyles.icon} />
            Autor da Silva
          </p>
        </article>

        <article className={styles.postSummary}>
          <a href="/post/1">Quem vencerá a corrida?</a>
          <h2>Um exemplo clássico para apresentar o conceito de limite em matemática é a corrida hipotética entre um coelho e uma tartaruga.</h2>
          <p>
            <FiCalendar className={commonStyles.icon} />
            10 de outubro de 2021
            <FiUser className={commonStyles.icon} />
            Autor da Silva
          </p>
        </article>

        <article className={styles.postSummary}>
          <a href="/post/1">Quem vencerá a corrida?</a>
          <h2>Um exemplo clássico para apresentar o conceito de limite em matemática é a corrida hipotética entre um coelho e uma tartaruga.</h2>
          <p>
            <FiCalendar className={commonStyles.icon} />
            10 de outubro de 2021
            <FiUser className={commonStyles.icon} />
            Autor da Silva
          </p>
        </article>

        <Link href="/">
          <a className={styles.nextPage}>Carregar mais posts</a>
        </Link>

      </section>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
