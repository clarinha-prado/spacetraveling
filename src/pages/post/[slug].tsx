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

  // formatar post retornado
  const post = {

    first_publication_date: props.post.first_publication_date,

    data: {
      title: props.post.data.title,
      banner: props.post.data.banner,
      author: props.post.data.author,

      content: props.post.data.content.map(item => {
        //item.text = RichText.asText(item.body);
        item["formatedText"] = RichText.asHtml(item.body);
        return item;
      })
    }
  }

  post.first_publication_date = format(
    new Date(post.first_publication_date),
    "d MMM yyyy",
    {
      locale: ptBR,
    }
  );

  function calcularTempoLeitura(content: Post["data"]["content"]) {

    const qtdPalavras = content.reduce((acc, item) => {

      if (!acc["soma"]) {
        acc["soma"] = 0;
      }
      acc["soma"] = (item["heading"].split(" ").length) + acc["soma"];
      // acc["soma"] = (item["body"].toString().split(" ").length) + acc["soma"];
      let qtdPalavrasBody = item["body"].reduce((acc2, subitem) => {

        if (!acc2["soma"]) {
          acc2["soma"] = 0;
        }
        acc2["soma"] = (subitem["text"].split(" ").length) + acc2["soma"];
        return acc2;
      }, {});
      acc["soma"] = Number(acc["soma"]) + qtdPalavrasBody["soma"];

      return acc;
    }, {});

    return Math.ceil(qtdPalavras["soma"] / 200);
  }

  return (
    <main className={commonStyles.container}>
      <Header />
      <section className={styles.postContainer}>
        <div className={styles.banner}>
          <img src={post.data.banner.url} alt={post.data.title} />
        </div>
        <div className={styles.preventOverlap}></div>
        <h1>{post.data.title}</h1>

        <p>
          <FiCalendar className={commonStyles.icon} />
          <span style={{ textTransform: 'capitalize' }}>
            {post.first_publication_date}
          </span>
          <FiUser className={commonStyles.icon} />
          <span style={{ textTransform: 'capitalize' }}>
            {post.data.author}
          </span>
          <FiClock className={commonStyles.icon} />
          <span>
            {`${calcularTempoLeitura(post.data.content)} min`}
          </span>
        </p>

        <div className={styles.postContent}>
          {post.data.content.map(item => (
            <div key={item.heading}>
              <header>
                {item.heading}
              </header>
              <div dangerouslySetInnerHTML={{ __html: item["formatedText"] }} />
            </div>
          ))}
        </div>
      </section>
    </main >
  );
}


// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const prismic = getPrismicClient();

  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.uid'],
    }
  );

  // Get the paths we want to pre-render based on posts
  const paths = posts.results.map((post) => ({
    params: { slug: post.uid },
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  // const x = await getStaticPaths();

  // const staticPages = x.paths.find(item => {
  //   return item.params.slug === slug;
  // });

  let response;
  const prismic = getPrismicClient();

  // if (staticPages === undefined) {

  //   const response1 = await prismic.query([
  //     Prismic.Predicates.at("my.post.uid", slug)]
  //   );
  //   response = response1.results[0];

  // } else {
  response = await prismic.getByUID('post', String(slug), {});
  // }

  const post = {

    first_publication_date: response.first_publication_date,
    ...response,

    data: {
      ...response.data,
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,

      content: response.data.content
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 24 // 1 dia
  }
};
