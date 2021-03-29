import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from "prismic-dom";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(props: PostProps) {

  return (
    <main className={commonStyles.container}>
      <header>
        <a href="/">
          <img src="/Logo.svg" alt="logo" />
        </a>
      </header>
      <img src="" alt="" />
      <section className={styles.postContainer}>
        <h1>{props.post.data.title}</h1>

        <p>
          <FiCalendar className={commonStyles.icon} />
          {props.post.first_publication_date}
          <FiUser className={commonStyles.icon} />
          {props.post.data.author}
          <FiClock className={commonStyles.icon} />
            4 min
        </p>

        <div className={styles.postContent}>
          {props.post.data.content.map(item => (
            <div key={item.heading}>
              <header>
                {item.heading}
              </header>
              <div key="0" dangerouslySetInnerHTML={{ __html: item.body }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  // formatar post retornado
  const post = {

    first_publication_date: format(
      new Date(response.first_publication_date),
      "d MMM yyyy",
      {
        locale: ptBR,
      }
    ),

    data: {
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,

      content: response.data.content.map(item => {
        item.body = RichText.asHtml(item.body);
        return item;
      })
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 24 // 1 dia
  }
};
