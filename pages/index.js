import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";

import Link from 'next/link'
const hicdex ='https://hdapi.teztools.io/v1/graphql'


export const getStaticProps = async() => {

  const queryObjkts = `
    query ObjktsByTag($tag: String!) {
     hic_et_nunc_token(where: {supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}}, order_by: {id: desc})  {
      id
      artifact_uri
      display_uri
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

  // const shuffleFotos = (a) => {
  //   for (let i = a.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [a[i], a[j]] = [a[j], a[i]];
  //   }
  //   return a;
  // }

    const { errors, data } = await fetchGraphQL(queryObjkts, 'ObjktsByTag', { tag: 'photography' })
    if (errors) {
      console.error(errors)
    }
    // console.log(data.hic_et_nunc_token.length)
    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/o.json');
    const fotos = data.hic_et_nunc_token.filter((i) => !banned.data.includes(i))
    // console.log(banned.data.includes(221965))
    // console.log(fotos.length)
    // console.log(banned.data[0])

    return {
      props: { fotos },
      revalidate: 120
  };
};


export default function Home({ fotos }) {
  const [shuffled,setShuffled] = useState();
  const random = Math.floor(Math.random() * fotos.length-288)
  const slicedFotos = fotos.slice(random, random+288)

  useEffect(() => {
     const shuffleFotos = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
     }
     setShuffled(shuffleFotos(slicedFotos)
     )
  }, [fotos])
   
  
  return (
    <>
    <Head>
        <title>fotographia.xyz</title>
        <meta name="description" content="fotographia.xyz" />
        <link rel="icon" href="/tezosmiami.ico" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@fotographia.xyz"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
        <meta name="twitter:title" content="fotographia.xyz"/>
        <meta name="twitter:image" content="/tezos512.png" />
      </Head>
      <p></p>
    <div className='container'>
    {shuffled?.map(f=> (
      <Link key={f.id} href={`/foto/${f.id}`} passHref>
        <div className='pop'>
      <Image
        alt=""
        height={270}
        width={180}
        objectFit='cover'
        key={f.id}
        src={'https://cloudflare-ipfs.com/ipfs/' + f.artifact_uri.slice(7)}>
       </Image>
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

