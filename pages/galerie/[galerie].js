

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const hicdex ='https://hdapi.teztools.io/v1/graphql'

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

export const getStaticPaths = async() => {
 
  const queryFotographos = `
  query fotographos($tag: String!) {
  hic_et_nunc_tag(where: {tag: {_eq: $tag}}) {
    tag_tokens(where: {token: {supply: {_neq: "0"}}}) {
      token {
        creator {
          address
          name
        }
      }
    }
  }
}`;

   const { errors, data } = await fetchGraphQL(queryFotographos, 'fotographos', { tag: 'photography' })
    if (errors) {
      console.error(errors)
    }
    const axios = require('axios');
    const response = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/w.json');
    const fotographos = data.hic_et_nunc_tag.filter(i => !response.data.includes(i.address));
    // .filter((i) => !response.includes(i.id));
    
    const paths = fotographos.map(f => {
      return {
          params: {
          galerie: `${f.name || f.address}`,
        }
      }
    })

  return {
      paths,
      fallback: 'blocking'
  };
};


export const getStaticProps = async({ params }) => {

  const objktsByAddress = `
query query_address($address: String!, $tag: String!) {
  hic_et_nunc_token(where: {creator: {address: {_eq: $address}, tokens: {token_tags: {tag: {tag: {_eq: $tag}}, token: {supply: {_neq: "0"}}}}}}) {
    artifact_uri
    display_uri
    id
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

    const { errors, data } = await fetchGraphQL(querySubjkt, 'query_name', { name: params.perfile })
    if (errors) {
      console.error(errors)
    }

    return data.hic_et_nunc_holder[0].address

  }
    
    const address = params.perfile.length == 36 ? params.perfile : await getAddress();
   
    const { errors, data } = await fetchGraphQL(objktsByAddress, 'query_address', { address: address, tag: 'photography' })
    if (errors) {
      console.error(errors)
    }

    const axios = require('axios');
    const response = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/o.json');
    const fotos = data.hic_et_nunc_token.filter(i => !response.data.includes(i.id));
  
    
  return {
      props: { fotos },
  };
};


export default function Perfile({ fotos }) {
    
  return (
    <>
      <Head>
        <title>fotographia.xyz</title>
        <meta name="description" content="fotographia.xyz" />
        <link rel="icon" href="/tezosmiami.ico" />
      </Head>
  <p></p>
    <div className='container'>
    {fotos.map(item => (
      <Link key={item.id} href={`/foto/${item.id}`} token={`https://cloudflare-ipfs.com/ipfs/${item.artifact_uri.slice(7)}`} passHref>
        <div className='pop'>
      <Image 
        alt=""
        height={270}
        width={180}
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

