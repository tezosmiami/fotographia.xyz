import Head from 'next/head'
import Image from 'next/image'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Masonry from 'react-masonry-css'
import Search from '../components/search'
import Link from 'next/link'


const hicdex ='https://api.hicdex.com/v1/graphql'
const teztok ='https://graphiql.teztok.com'

const breakpointColumns = {
  default: 6,
  1800: 6,
  1500: 5,
  1200: 4,
  900: 3,
  600: 2
};

export const getServerSideProps = async() => {

  // const queryObjkts = `
  //   query ObjktsByTag($tag: String!, $offset: Int!) {
  //    hic_et_nunc_token(where: {mime: {_ilike: "%image%", _neq: "image/gif"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}}, order_by: {id: desc}, offset: $offset)  {
  //     id
  //     display_uri
  //     artifact_uri
  //     creator {
  //       address

  //     }
  //   }
  // }`;

  const queryObjkts = `
    query ObjktsByTag($tag: String!, $offset: Int!) {
     tokens(where: {mime_type: {_ilike: "%image%", _neq: "image/gif"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}}, order_by: {opid: desc}, offset: $offset)  {
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
    const banned = await axios.get('https://raw.githubusercontent.com/teia-community/teia-report/main/restricted.json');
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
  const [searchData,setSearchData] = useState([]);
  const { query, router }= useRouter();

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
        <meta name="twitter:image" content="https://gateway.pinata.cloud/ipfs/Qmeqb65UxjDdb56ZADpZu3yg3nVVE5gwGGkXk8ASjSPnyL"/>
     </Head>
     <Search returnSearch={setSearchData} query={query.search}/>

    {!query.search && <Masonry
        breakpointCols={breakpointColumns}
        className='grid'
        columnClassName='column'>
    {fotos?.map(f=> (
      <Link key={f.id} className='center' href={`/foto/${f.id}`} passHref>
        <img alt='' className= 'pop' key={f.artifact_uri+f.token_id}  src={`https://ipfs.io/ipfs/${f.display_uri ? f.display_uri?.slice(7) : f.artifact_uri.slice(7)}`}/>
      </Link>
     ))}
  </Masonry>}
 
   <p></p>  
  </>
  )
}

