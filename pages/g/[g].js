import Head from 'next/head'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import Link from 'next/link'

const hicdex ='https://api.hicdex.com/v1/graphql'

const breakpointColumns = {
  default: 6,
  1800: 6,
  1500: 5,
  1200: 4,
  900: 3,
  600: 2
};
const querySubjkt = `
query query_name ($name: String!) {
  hic_et_nunc_holder(where: {name: {_eq: $name}}) {
    address
  }
}
`

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

// export const getStaticPaths = async() => {
 
//   const queryFotographos = `
//   query fotographos ($tag: String!) {
//   hic_et_nunc_tag(where: {tag: {_eq: $tag}}) {
//     tag_tokens(where: {token: {supply: {_neq: "0"}}}) {
//       token {
//         creator {
//           address
//           name
//         }
//       }
//     }
//   }
// }`;

//    const { errors, data } = await fetchGraphQL(queryFotographos, 'fotographos', { tag: 'photography' })
//     if (errors) {
//       console.error(errors)
//     }

//     const axios = require('axios');
//     const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/w.json');
//     const fotographos = data.hic_et_nunc_tag[0].tag_tokens.filter(i => !banned.data.includes(i.token.creator.address));
//     const paths = fotographos.map(f => {
//       return {
//           params: {
//           g: `${f.name || f.address}`,
//           // banned: response.data
//         }
//       }
//     })

//   return {
//       paths,
//       fallback: 'blocking'
//   };
// };


export const getServerSideProps = async({ params }) => {

  const objktsByAddress = `
query query_address ($address: String!) {
  hic_et_nunc_token(where: {mime: {_ilike: "%image%", _neq: "image/gif"}, supply: {_neq: "0"},
   token_tags: {tag: {tag: {_eq: "photography"}}}, creator: {address: {_eq: $address}}}, order_by: {id: desc}) {
    id
    mime
    creator {
      address
      name
    }
    artifact_uri
  }
}


`

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

  const getAddress = async () => {

    const { errors, data } = await fetchGraphQL(querySubjkt, 'query_name', { name: params.g })
    if (errors) {
      console.error(errors)
    }
    if (!data.hic_et_nunc_holder[0]) return {notFound: true}
    return data.hic_et_nunc_holder[0].address

  }
    
    const address = params.g.length == 36 ? params.g : await getAddress();
   
    const { errors, data } = await fetchGraphQL(objktsByAddress, 'query_address', { address: address })
    if (errors) {
      console.error(errors)
    }
    if (!data) return {notFound: true}
    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/teia-community/teia-report/main/restricted.json');
    const fotos = data.hic_et_nunc_token.filter(i => !banned.data.includes(address));
    
    if (banned.data.includes(address)) {return {notFound: true}}
    
  return {
      props: { fotos },
  };
};

export default function Galerie({ fotos }) {
    
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
      <p><a href={`https://tzkt.io/${fotos[0]?.creator.address}`} target="blank"  rel="noopener noreferrer">
      {!fotos[0] ? 'nada yet...' : fotos[0]?.creator.name || fotos[0]?.creator.address.substr(0, 5) + "..." + fotos[0]?.creator.address.substr(-5)}</a></p>
      <Masonry
        breakpointCols={breakpointColumns}
        className='grid'
        columnClassName='column'>
    {fotos?.map(f=> (
      <Link key={f.id} className='center' href={`/foto/${f.id}`} passHref>
        <img alt='' className= 'pop' key={f.artifact_uri+f.token_id}  src={`https://ipfs.io/ipfs/${f.display_uri ? f.display_uri?.slice(7) : f.artifact_uri.slice(7)}`}/>
      </Link>
     ))}
  </Masonry>
   <p></p>  
  </>
  )
}

