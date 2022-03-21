import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { usePassengerContext } from "../../context/passenger-context";
import Link from 'next/link'

const hicdex ='https://hdapi.teztools.io/v1/graphql'

// const querySubjkt = `
// query Subjkt($address: String!) {
//   hic_et_nunc_holder(where: {address: {_eq: $address}) {
//     name
//   }
// }
// `
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
 
  const queryObjkts = `
    query Objkts($tag: String!) {
     hic_et_nunc_token(where: {supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}})  {
      id
      creator{
        address
      }
       }
   }
   `;
   
   
    const { errors, data } = await fetchGraphQL(queryObjkts, 'Objkts', { tag: 'photography' })
    if (errors) {
      console.error(errors)
    }

    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc/main/filters/w.json');
    const gletchard = data.hic_et_nunc_token.filter(g => !banned.data.includes(g.creator.address));
    const paths = gletchard.map(g => {
      return {
          params: {
          gletch: `${g.id}`
        }
      }
    })

  return {
      paths,
      fallback: 'blocking'
  };
};

export const getStaticProps = async({ params }) => {
  const queryObjktsbyId = `
      query ObjktsbyId($Id: bigint!) {
      hic_et_nunc_token(where: {id: {_eq: $Id}}) {
        artifact_uri
        description
        id
        title
        supply
        creator {
          address
          name
        }
        token_holders{
         holder_id
        }
        swaps (order_by: {price: desc}, where: {token: {swaps: {status: {_eq: "0"}}}, contract_version: {_eq: "2"}, status: {_eq:"0"}}){
          amount
          price
          status
          id
        }
      }
    }`
    
    const { errors, data } = await fetchGraphQL(queryObjktsbyId, 'ObjktsbyId', { Id: params.gletch})
    if (errors) {
      console.error(errors)
    }
    const card = data.hic_et_nunc_token[0]
    var ownedBy = (card.token_holders[card.token_holders.length-1].holder_id);
    const swaps = card.swaps[card.swaps.length-1] || null;
    const supply= card.supply;
  
  return {
      props: { card, supply, swaps },
  };
};

const Gletch = ({ card, supply, swaps }) => { 
const [message,setMessage] = useState();
const [name,setName] = useState()
const app = usePassengerContext();

// useEffect(() => {
//   async function fetchData() {
//     const { errors, data } = await fetchGraphQL(querySubjkt, 'Subjkt', { address: ownedBy })
//     if (errors) {
//       console.error(errors)
//     }
//    console.log(data)
//     data.hic_et_nunc_holder[0] && setName(data.hic_et_nunc_holder[0].name);
//   }
  
//   fetchData();
 
//  }, [])


const handleCollect = (swapId, xtzAmount) => async() => {
  try {
      setMessage('Preparing Objkt. . .');
      const isCollected = await app.collect(swapId, xtzAmount);
      setMessage(isCollected ? 'You got it!' : 'Something happened, try again. . .');
    
  } catch(e) {
      setMessage('Objkt not found - please try again. . .');
      console.log('Error: ', e);
  }
  setTimeout(() => {
      setMessage(null);
  }, 3200);
};
 


return(
    <>
      <Head>
        <title>g̴l̸e̵t̷c̴h̶a̵r̷d̷.̷x̴y̸z̴</title>
        <meta name="description" content="gletchard.xyz" />
        <link rel="icon" href="/tezosmiami.ico" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@gletchard.xyz"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
        <meta name="twitter:title" content="gletchard.xyz"/>
        <meta name="twitter:image" content={'https://cloudflare-ipfs.com/ipfs/' + card.artifact_uri.slice(7)} />
      </Head>
    <div className='cardcontainer'>
        <div className='imagecontainer'>
        <Image 
        alt=''
        layout='fill'
        objectFit='contain'
        src={'https://cloudflare-ipfs.com/ipfs/' + card.artifact_uri.slice(7)}>
        </Image>
        </div>
        <p></p>
       
    <div className='bold'>{card.title}</div>
    <Link key={card.address} href={`/g/${card.creator.name || card.creator.address}`} passHref>
    <p>
    by:  <a> {card.creator.name || card.creator.address}
    </a>
    </p>
    </Link>
        <li> {card.description}</li>
        <p>{supply > 1 ? supply + ' editions' : ' single edition'} -  <a href={`https://hecticnun.xyz/objkt/${card.id}`} target="blank"  rel="noopener noreferrer">objkt#{card.id}</a></p>
        {/* <p>owned by: <a href={`https://hicetnunc.miami/tz/${ownedBy}`} target="blank" rel="noopener noreferrer">{name || ownedBy.substr(0, 5) + "..." + ownedBy.substr(-5) }</a></p> */}
         {supply && swaps?.status==0 ? <a onClick={handleCollect(swaps.id, swaps.price)}>{`collect for ${(swaps.price* 0.000001).toFixed(2)} tez`}</a> : 'not for sale'}
    </div>
    
  </>
)
}
export default Gletch;