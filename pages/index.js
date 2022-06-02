import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context"
import Link from 'next/link'

const hicdex ='https://api.hicdex.com/v1/graphql'
const teztok ='https://graphiql.teztok.com'

export const getServerSideProps = async() => {

  const queryObjkts = `
    query ObjktsByTag($tag: String!, $offset: Int!) {
     hic_et_nunc_token(where: {mime: {_ilike: "%image%", _neq: "image/gif"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}}, order_by: {id: desc}, offset: $offset)  {
      id
      display_uri
      artifact_uri
      creator {
        address

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


    async function getObjkts(offset) {
      const { errors, data } = await fetchGraphQL(queryObjkts, 'ObjktsByTag', { tag: 'photography', offset: offset })
      if (errors) {
        console.error(errors)
       }
       return data.hic_et_nunc_token
    }

    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json');
    const latestFotos = await getObjkts(0)
    const random = Math.floor(Math.random() * 38000)

    const randomFotos = await getObjkts(random)
    const filtered = randomFotos.slice(0,81).concat(latestFotos.slice(0,26)).filter((i) => !banned.data.includes(i.creator.address))
    const fotos = shuffleFotos(filtered)
    return {
      props: { fotos }
      // revalidate: 60
  };
};


export default function Home({ fotos }) {
  // const [shuffled,setShuffled] = useState();
  // const random = Math.floor(Math.random() * fotos.length-81)
  // const slicedFotos = fotos.slice(random, random+81)
  
  // useEffect(() => {
  //    const shuffleFotos = (a) => {
  //     for (let i = a.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [a[i], a[j]] = [a[j], a[i]];
  //     }
  //     return a;
  //    }
  //    setShuffled(shuffleFotos(slicedFotos.concat(fotos.slice(0,26)))
  //    )
  // }, [fotos])
   
  
  return (
    <>
    <Head>
        <title>fotographia.xyz</title>
        <meta name="description" content="tezos - hicetnunc foto objkts. ." />
        <meta property="og:title" content="fotographia" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fotographia.xyz" />
        <meta property="og:image" content="/fotographia7.jpg" />
        <meta property="og:description" content="tezos - hicetnunc foto objkts" />
        <link rel="icon" href="/fotographia7.jpg" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
        <meta name="twitter:description" content="tezos - hicetnunc foto objkts" />
        <meta name="twitter:title" content=". . ."/>
        <meta name="twitter:image" content="https://gateway.pinata.cloud/ipfs/QmXDKgmL8t5aezg4XnpvT8gWfevUWhiiKDmGrduJxAHjd6"/>
     </Head>
      {/* <p>new mints</p>
  <div className='container'>
    {fotos?.slice(0,32).map(f=> (
      <Link key={f.id} href={`/foto/${f.id}`} passHref>
        <div className='pop'>
      <Image
        alt=""
        height={270}
        width={180}
        objectFit='cover'
        key={f.id}
        src={'https://cloudflare-ipfs.com/ipfs/' + f.artifact_uri.slice(7)}
        // blurDataURL={'https://cloudflare-ipfs.com/ipfs/' + f.artifact_uri.slice(7)}
        >
       </Image>
      </div>
      </Link>
       ))}
  </div>
  <p>random fotos</p> */}
  <p></p>
  <div className='container'>
    {fotos?.map(f=> (
      <Link key={f.id} href={`/foto/${f.id}`} passHref>
        <div className='pop'>
      <Image
        alt=""
        // placeholder='blur'
        // quality={30}
        height={270}
        width={180}
        objectFit='cover'
        key={f.id}
        src={'https://ipfs.io/ipfs/' + f.display_uri.slice(7)}
        // blurDataURL={'https://cloudflare-ipfs.com/ipfs/' + f.artifact_uri.slice(7)}
        >
       </Image>
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

