import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from "prismic-dom";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';

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

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  const router = useRouter()
  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  function calcularTempoLeitura(content: Post["data"]["content"]) {

    let qtdPalavras = content.reduce((acc, item) => {
      if (!acc["soma"]) {
        acc["soma"] = 0;
      }
      acc["soma"] = (item["heading"].split(" ").length) + acc["soma"];
      acc["soma"] = (item["body"].toString().split(" ").length) + acc["soma"];

      return acc;
    }, {})
    return Math.ceil(qtdPalavras["soma"] / 200);
  }

  return (
    <main className={commonStyles.container}>
      <Header />
      <section className={styles.postContainer}>
        <div className={styles.banner}>
          <img src={props.post.data.banner.url} alt={props.post.data.title} />
        </div>
        <div style={{ height: "400px", position: "relative", marginBottom: "80px" }}></div>
        <h1>{props.post.data.title}</h1>

        <p>
          <FiCalendar className={commonStyles.icon} />
          {format(
            new Date(props.post.first_publication_date),
            "d MMM yyyy",
            {
              locale: ptBR,
            }
          )}
          <FiUser className={commonStyles.icon} />
          {props.post.data.author}
          <FiClock className={commonStyles.icon} />
          {`${calcularTempoLeitura(props.post.data.content)} min`}
        </p>

        <div className={styles.postContent}>
          {props.post.data.content.map(item => (
            <div key={item.heading}>
              <header>
                {item.heading}
              </header>
              <div dangerouslySetInnerHTML={{ __html: item.body.toString() }} />
            </div>
          ))}
        </div>
      </section>
    </main >
  );
}

// This function gets called at build time
export const getStaticPaths = async () => {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [{ params: { slug: 'joana-darc' } }],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const x = await getStaticPaths();

  const staticPages = x.paths.find((item) => {
    return item.params.slug === slug;
  });

  let response;
  const prismic = getPrismicClient();

  if (staticPages === undefined) {

    const response1 = await prismic.query([
      Prismic.Predicates.at("my.post.uid", slug)]
    );
    response = response1.results[0];

  } else {
    response = await prismic.getByUID('post', String(slug), {});
  }

  // formatar post retornado
  const post = {

    first_publication_date: response.first_publication_date,

    data: {
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,

      content: response.data.content.map(item => {
        //        item.text = RichText.asText(item.body);
        item.body = RichText.asHtml(item.body);
        return item;
      })
    }
  }
  console.log(post);

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 24 // 1 dia
  }
};
