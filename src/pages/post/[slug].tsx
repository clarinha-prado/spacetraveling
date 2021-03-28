import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

export default function Post() {
  return (
    <main className={commonStyles.container}>
      <header>
        <a href="/">
          <img src="/Logo.svg" alt="logo" />
        </a>
      </header>
      <img src="" alt="" />
      <section className={styles.postContainer}>
        <h1>Quem vencerá a corrida?</h1>
        <p>
          <FiCalendar className={commonStyles.icon} />
            10 de outubro de 2021
            <FiUser className={commonStyles.icon} />
            Autor da Silva
            <FiClock className={commonStyles.icon} />
            4 min
      </p>

        <div className={styles.postContent}>
          <header>
            O devir: entre Heráclito e Nietzsche
          </header>
          <div>
            <p>
              A significação em torno do termo devir está longe, na filosofia, de uma univocidade; o que não significa dizer que seja ele vago. Ao contrário, manifesta-se intrigante a recorrência a esse termo durante a história da filosofia. Com efeito, conscientes de tais dificuldades, devemos, portanto, optar por um caminho o mais específico que nos for possível, a fim de que alcancemos certa assimilação do tema. De maneira geral nosso termo em questão é utilizado como sinônimo de “tornar-se” ou, ainda, “vir-a-ser” – em outros momentos também é utilizado para denotar a mudança mesma ou o movimento, propriamente dito –, o que permite que nosso raciocínio já tome certa forma. A nós interessará a utilização da expressão vir-a-ser, a partir da filosofia nietzschiana e seu elogio ao efésio Heráclito.
            </p>

            <p>
              Quando os jônicos, no esforço de encontrarem o substrato material elementar de todas as coisas, se dispuseram à observação dos astros e de todas as realidades fenomenológicas certamente constataram que tudo estava em um constante movimento, e igualmente em constante transformação. O que levou Heráclito a sistematizar sua filosofia a partir do vir a ser, do movimento e transformação constantes em tudo o que se observa. O fogo, em seu pensamento, adquire característica ilustrativa para representar o logos como o elemento originário, mas também simboliza o vir a ser na medida em que seu movimento dançante e pertinente faz a passagem do uno para o múltiplo e, por isso, expressão do devir.
            </p>

            <p>
              Nietzsche em sua filosofia, sobretudo em A filosofia na época trágica dos gregos, demonstra ter se apropriado de elementos que Heráclito dispunha em seu pensamento e que adquiriu maior formulação quando na filosofia dionisíaca do filósofo do martelo. No que se refere ao vir-a-ser, Nietzsche observa a regularidade no próprio ritmo das transformações. Tudo o que entendemos por geração e mudança, em ambos os filósofos – evidentemente que em Heráclito isso se refere mais à sua visão cosmológica –, se efetiva a partir da guerra, luta, tensão entre as forças contrárias. Os opostos são os conceitos usuais que consideramos antagônicos, como quente-frio, molhado-seco, dia-noite, e todos quantos pensarmos; a passagem de um para o outro é o que se denomina vir-a-ser; este se dá pela relação conflitante entre as forças, já que para que uma prevaleça, a outra deve deixar de existir.
            </p>

            <p>
              Dois pontos importantes em tais afirmações se constituem como paradoxo – o que não faz com que as proposições sobre o devir sejam falaciosas, senão as afirma ainda mais. O primeiro se trata da percepção do movimento; aparentemente percebemos um movimento a partir de um ponto estático – em outros termos, sabemos que algo se move porque nos referenciamos em algo que está parado –, com isso nos deparamos com a impossibilidade de identificar o movimento, já que a ele pertenço e se afirmo como Heráclito que “tudo flui”, logo, eu que pertenço a esse tudo também estou em movimento. Um segundo tópico é que uma realidade, ou um ente, não pode se tornar seu contrário se já não houver em seu interior uma mínima partícula de seu oposto; ou seja, o frio só se torna quente porque uma partícula deste permanece naquele; se ambos fossem, pura e simplesmente, quente e frio, jamais uma realidade se transformaria em outra.
            </p>
          </div>

          <header>
            O devir: entre Heráclito e Nietzsche
          </header>
          <div>
            <p>
              A significação em torno do termo devir está longe, na filosofia, de uma univocidade; o que não significa dizer que seja ele vago. Ao contrário, manifesta-se intrigante a recorrência a esse termo durante a história da filosofia. Com efeito, conscientes de tais dificuldades, devemos, portanto, optar por um caminho o mais específico que nos for possível, a fim de que alcancemos certa assimilação do tema. De maneira geral nosso termo em questão é utilizado como sinônimo de “tornar-se” ou, ainda, “vir-a-ser” – em outros momentos também é utilizado para denotar a mudança mesma ou o movimento, propriamente dito –, o que permite que nosso raciocínio já tome certa forma. A nós interessará a utilização da expressão vir-a-ser, a partir da filosofia nietzschiana e seu elogio ao efésio Heráclito.
            </p>

            <p>
              Quando os jônicos, no esforço de encontrarem o substrato material elementar de todas as coisas, se dispuseram à observação dos astros e de todas as realidades fenomenológicas certamente constataram que tudo estava em um constante movimento, e igualmente em constante transformação. O que levou Heráclito a sistematizar sua filosofia a partir do vir a ser, do movimento e transformação constantes em tudo o que se observa. O fogo, em seu pensamento, adquire característica ilustrativa para representar o logos como o elemento originário, mas também simboliza o vir a ser na medida em que seu movimento dançante e pertinente faz a passagem do uno para o múltiplo e, por isso, expressão do devir.
            </p>

            <p>
              Nietzsche em sua filosofia, sobretudo em A filosofia na época trágica dos gregos, demonstra ter se apropriado de elementos que Heráclito dispunha em seu pensamento e que adquiriu maior formulação quando na filosofia dionisíaca do filósofo do martelo. No que se refere ao vir-a-ser, Nietzsche observa a regularidade no próprio ritmo das transformações. Tudo o que entendemos por geração e mudança, em ambos os filósofos – evidentemente que em Heráclito isso se refere mais à sua visão cosmológica –, se efetiva a partir da guerra, luta, tensão entre as forças contrárias. Os opostos são os conceitos usuais que consideramos antagônicos, como quente-frio, molhado-seco, dia-noite, e todos quantos pensarmos; a passagem de um para o outro é o que se denomina vir-a-ser; este se dá pela relação conflitante entre as forças, já que para que uma prevaleça, a outra deve deixar de existir.
            </p>

            <p>
              Dois pontos importantes em tais afirmações se constituem como paradoxo – o que não faz com que as proposições sobre o devir sejam falaciosas, senão as afirma ainda mais. O primeiro se trata da percepção do movimento; aparentemente percebemos um movimento a partir de um ponto estático – em outros termos, sabemos que algo se move porque nos referenciamos em algo que está parado –, com isso nos deparamos com a impossibilidade de identificar o movimento, já que a ele pertenço e se afirmo como Heráclito que “tudo flui”, logo, eu que pertenço a esse tudo também estou em movimento. Um segundo tópico é que uma realidade, ou um ente, não pode se tornar seu contrário se já não houver em seu interior uma mínima partícula de seu oposto; ou seja, o frio só se torna quente porque uma partícula deste permanece naquele; se ambos fossem, pura e simplesmente, quente e frio, jamais uma realidade se transformaria em outra.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
