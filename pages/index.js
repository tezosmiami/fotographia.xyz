import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";

import Link from 'next/link'
const hicdex ='https://hdapi.teztools.io/v1/graphql'


export const getStaticProps = async() => {

  const queryObjkts = `
    query ObjktsByTag($tag: String!) {
     hic_et_nunc_token(where: {supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}})  {
      id
      artifact_uri
      display_uri
      mime
      token_tags {
        tag {
          tag
        }
      }
      creator {
        address
        name
      }
    }
  }`;

   async function fetchGraphQL(queryObjkts, name, variables) {
    let result = await fetch(hicdex, {
      method: 'POST',
      body: JSON.stringify({
        query: queryObjkts,
        variables: variables,
        operationName: name,
      }),
    })
    return await result.json()
  }

  const shuffleFotos = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

    const { errors, data } = await fetchGraphQL(queryObjkts, 'ObjktsByTag', { tag: 'photography' })
    if (errors) {
      console.error(errors)
    }
    const axios = require('axios');
    const response = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/o.json');
    const fotos = shuffleFotos(data.hic_et_nunc_token.filter(i => !response.data.includes(i.id)));
  return {
      props: { fotos },
  };
};


export default function Home({ fotos }) {
  // const [shuffle,setShuffle] = useState();
  const app = usePassengerContext();  

  // useEffect(() => {
  //    const shuffleFotos = (a) => {
  //     for (let i = a.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [a[i], a[j]] = [a[j], a[i]];
  //     }
  //     return a;
  //    }
  //    setShuffle(shuffleFotos(fotos)
  //    )
  // }, [fotos])
    
  return (
    <>
    <Head>
        <title>fotographia.xyz</title>
        <meta name="description" content="fotographia.xyz" />
        <link rel="icon" href="/tezosmiami.ico" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@fotographia.xyz"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
         <meta name="twitter:title" content="fotographia.xyz/>
      </Head>
      <p></p>
    <div className='container'>
    {fotos.map(item => (
      <Link key={item.id} href={`/foto/${item.id}`} passHref>
        <div className='pop'>
      <Image 
        alt=""
        height={270}
        width={180}
        objectFit='cover'
        key={item.id}
        src={'https://cloudflare-ipfs.com/ipfs/' + item.artifact_uri.slice(7)}>
       </Image>
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

