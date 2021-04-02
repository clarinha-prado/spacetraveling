import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from "prismic-dom";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { useEffect, useState, MouseEvent, useRef } from 'react';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  prevSlug: string;
  prevTitle: string;
  nextSlug: string;
  nextTitle: string;
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
  preview: boolean;
  post: Post;
}

export default function Post(props: PostProps) {

  //const [currPage, setCurrPage] = useState('');

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  const router = useRouter()
  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  // formatar post retornado
  const post = {

    first_publication_date: props.post.first_publication_date,
    last_publication_date: props.post.last_publication_date,
    prevSlug: props.post.prevSlug,
    prevTitle: props.post.prevTitle,
    nextSlug: props.post.nextSlug,
    nextTitle: props.post.nextTitle,

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

  post.last_publication_date = post.last_publication_date ? format(
    new Date(post.last_publication_date),
    "d MMM yyyy', às' HH:mm",
    {
      locale: ptBR,
    }
  ) : '';

  // function Utterances() {
  //   const utter = useRef<HTMLDivElement>();

  //   useEffect(() => {
  //     if (utter) {
  //       utter.current.removeChild;
  //       const script = document.createElement('script');
  //       script.setAttribute("src", "https://utteranc.es/client.js");
  //       script.setAttribute("crossorigin", "anonymous");
  //       script.setAttribute("async", "true");
  //       script.setAttribute("repo", "clarinha-prado/spacetraveling-comments");
  //       script.setAttribute("issue-term", "pathname");
  //       script.setAttribute("theme", "photon-dark");
  //       utter.current.appendChild(script);
  //     }
  //   }, []);

  //   return <div ref={utter} />;
  // }

  const addUtterancesScript = (
    parentElement,
    label,
    issueTerm,
    isIssueNumber
  ): void => {
    console.log("\nlabel: " + label + " issueTerm: " + issueTerm + " isIssueNumber: ", isIssueNumber);
    const script = document.createElement('script');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute('repo', "clarinha-prado/spacetraveling-comments");
    if (label !== '') {
      script.setAttribute('label', label);
    }

    if (isIssueNumber) {
      script.setAttribute('issue-number', issueTerm);
    } else {
      script.setAttribute('issue-term', issueTerm);
    }

    script.setAttribute('theme', "photon-dark");

    parentElement.appendChild(script);
  };

  function Utterances(): JSX.Element {
    const issueTerm = 'pathname';
    const label = 'blog-comment';

    useEffect(() => {
      // Get comments box
      const commentsBox = document.getElementById('commentsBox');

      // Check if comments box is loaded
      if (!commentsBox) {
        return;
      }

      // Get utterances
      const utterances = document.getElementsByClassName('utterances')[0];

      // Remove utterances if it exists
      if (utterances) {
        utterances.remove();
      }

      // Add utterances script
      addUtterancesScript(commentsBox, label, issueTerm, false);
    });

    return <div id="commentsBox" />;
  }

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
    <>
      <div className={styles.divHeader}>
        <Header />
      </div>
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt={post.data.title} />
      </div>
      <main className={commonStyles.container}>
        <section className={styles.postContainer}>
          <div className={styles.preventOverlap}></div>
          <h1>{post.data.title}</h1>

          <p>
            <FiCalendar className={commonStyles.icon} />
            {/* <span style={{ textTransform: 'capitalize' }}> */}
            <span>
              {post.first_publication_date}
            </span>
            <FiUser className={commonStyles.icon} />
            {/* <span style={{ textTransform: 'capitalize' }}> */}
            <span>
              {post.data.author}
            </span>
            <FiClock className={commonStyles.icon} />
            <span>
              {`${calcularTempoLeitura(post.data.content)} min`}
            </span>
          </p>
          <p className={styles.modifiedDate}>
            * editado em {post.last_publication_date ? post.last_publication_date : ''}
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
          <hr />
          <nav className={styles.navContainer}>

            <div>
              <p>{post.prevTitle}</p>

              {!post.prevSlug ? '' :
                <Link href={`/post/${post.prevSlug}`}>
                  <a><button
                    type="button"
                    className={styles.nextPage}
                  >
                    Post anterior
              </button></a>
                </Link>
              }
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}
            >
              <p>{post.nextTitle}</p>

              {!post.nextSlug ? '' :
                <Link href={`/post/${post.nextSlug}`}>
                  <a><button
                    type="button"
                    className={styles.nextPage}
                  >
                    Próximo post
                  </button></a>
                </Link>
              }

            </div>
          </nav>

          <div className={styles.commentsContainer}>
            {Utterances()}
          </div>

          {props.preview ?
            <Link href="/api/exit-preview">
              <div className={styles.previewLink}>
                <a>Sair do modo Preview</a>
              </div>
            </Link>
            : ''}
        </section>
      </main >
    </>
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

export const getStaticProps: GetStaticProps = async ({ params,
  preview = false,
  previewData }) => {
  const { slug } = params;

  let response;
  const prismic = getPrismicClient();

  response = await prismic.getByUID('post', String(slug), {});

  // busca o post anterior
  let postResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title'],
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]'
    }
  );
  const prevSlug = postResponse.results[0] === undefined ? '' : postResponse.results[0].uid;
  const prevTitle = postResponse.results[0] === undefined ? '' :
    postResponse.results[0].data ? postResponse.results[0].data.title : '';

  // busca o próximo post
  postResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title'],
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]'
    }
  );
  const nextSlug = postResponse.results[0] === undefined ? '' : postResponse.results[0].uid;
  const nextTitle = postResponse.results[0] === undefined ? '' :
    postResponse.results[0].data ? postResponse.results[0].data.title : '';

  const post = {

    first_publication_date: response.first_publication_date,

    last_publication_date: response.last_publication_date,
    prevSlug,
    prevTitle,
    nextSlug,
    nextTitle,
    ...response,

    data: {
      ...response.data,
      title: response.data.title,
      banner: response.data.banner,
      author: response.data.author,

      content: response.data.content
    }
  }

  if (!prevTitle || prevTitle === '') {
    delete post.prevSlug;
    delete post.prevTitle;
  }

  if (!nextTitle || nextTitle === '') {
    delete post.nextSlug;
    delete post.nextTitle;
  }

  if (!post.last_publication_date) {
    delete post.last_publication_date;
  }

  return {
    props: {
      post,
      preview
    },
    revalidate: 60 * 60 * 24 // 1 dia
  }
};
