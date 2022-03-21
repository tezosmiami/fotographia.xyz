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
 
  const queryGletchardists = `
  query gletchardists ($tag: String!) {
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

   const { errors, data } = await fetchGraphQL(queryGletchardists, 'gletchardists', { tag: 'glitchard' })
    if (errors) {
      console.error(errors)
    }

    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/w.json');
    const gletchardists = data.hic_et_nunc_tag[0].tag_tokens.filter(i => !banned.data.includes(i.token.creator.address));

    const paths = gletchardists.map(f => {
      return {
          params: {
          g: `${g.name || g.address}`,
          // banned: response.data
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
  hic_et_nunc_token(where: {mime: {supply: {_neq: "0"}}, creator: {address: {_eq: $address}}, token_tags: {tag: {tag: {_eq: $tag}}}}, order_by: {id: desc}) {
    artifact_uri
    display_uri
    id
    creator{
      address
      name
    }
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

    return data.hic_et_nunc_holder[0].address

  }
    
    const address = params.g.length == 36 ? params.g : await getAddress();
   
    const { errors, data } = await fetchGraphQL(objktsByAddress, 'query_address', { address: address, tag: 'photography' })
    if (errors) {
      console.error(errors)
    }

    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/w.json');
    const gletches = data.hic_et_nunc_token.filter(i => !banned.data.includes(i.address));
    if (banned.data.includes(address)) {return {notFound: true}}
    
  return {
      props: { gletches },
  };
};


export default function Galerie({ gletches }) {
    
  return (
    <>
      <Head>
        <title>g̴l̸e̵t̷c̴h̶a̵r̷d̷.̷x̴y̸z̴</title>
        <meta name="description" content="gletchard.xyz" />
        <link rel="icon" href="/tezosmiami.ico" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@gletchard.xyz"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
        <meta name="twitter:title" content="gletchard.xyz"/>
        <meta name="twitter:image" content="/tezos512.png" />
      </Head>
      <p><a href={`https://tzkt.io/${gletchard[0]?.creator.address}`} target="blank"  rel="noopener noreferrer">
      {gletchard[0]?.creator.name || gletchard[0]?.creator.address}</a></p>
    <div className='container'>
    {gletchard.map(g => (
      <Link key={g.id} href={`/gletch/${g.id}`} token={`https://cloudflare-ipfs.com/ipfs/${g.artifact_uri.slice(7)}`} passHref>
        <div className='pop'>
      <Image 
        alt=""
        height={270}
        width={180}
        key={g.id}
        objectFit='cover'
        src={'https://cloudflare-ipfs.com/ipfs/' + g.artifact_uri.slice(7)}>
       </Image>
      </div>
      </Link>
     ))}
   </div>
   <p></p>  
  </>
  )
}

