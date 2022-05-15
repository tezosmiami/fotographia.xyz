import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { usePassengerContext } from "../../context/passenger-context";
import Link from 'next/link'

const hicdex ='https://api.hicdex.com/v1/graphql'

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

// export const getStaticPaths = async() => {
 
//   const queryObjkts = `
//     query Objkts($tag: String!) {
//      hic_et_nunc_token(where: {mime: {_ilike: "%image%"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag}}}})  {
//       id
//       creator{
//         address
//         name
//       }
//        }
//    }
//    `;
   
   
//     const { errors, data } = await fetchGraphQL(queryObjkts, 'Objkts', { tag: 'photography' })
//     if (errors) {
//       console.error(errors)
//     }

//     const axios = require('axios');
//     const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json');
//     const fotos = data.hic_et_nunc_token.filter(f => !banned.data.includes(f.creator.address));

//    const paths = fotos.map(f => {
//     return {
//           params: {
//           foto: `${f.id}`
//         }
//       }
//     })

//   return {
//       paths,
//       fallback: 'blocking'
//   };
// };

export const getServerSideProps = async({ params }) => {
  const queryObjktsbyId = `
      query ObjktsbyId($Id: bigint!) {
      hic_et_nunc_token(where: {id: {_eq: $Id}, token_tags: {tag: {tag: {_ilike: "%photo%"}}}}) {
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
    
    const { errors, data } = await fetchGraphQL(queryObjktsbyId, 'ObjktsbyId', { Id: params.foto})
    if (errors) {
      console.error(errors)
    }
    const axios = require('axios');
    const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json');
    const card = data?.hic_et_nunc_token[0] || null;
    if (!card ||  banned.data.includes(card.creator.address)) return {notFound: true}
    var ownedBy = (card.token_holders[card.token_holders.length-1].holder_id);
    const swaps = card.swaps[card.swaps.length-1] || null;
    const supply= card.supply;
  
  return {
      props: { card, supply, swaps },
  };
};

const Foto = ({ card, supply, swaps }) => { 
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
 
``

return(
    <>
      <Head>
        <title>fotographia.xyz</title>
        <meta name="description" content="fotographia.xyz" />
        <link rel="icon" href="/tezosmiami.ico" />
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="@fotographia.xyz"/>
        <meta name="twitter:creator" content="@tezosmiami"/>
        <meta name="twitter:title" content="fotographia.xyz"/>
        <meta name="twitter:image" content={'https://cloudflare-ipfs.com/ipfs/' + card.artifact_uri.slice(7)} />
      </Head>
    <div className='cardcontainer'>
        <div className='imagecontainer'>
        <Image 
        alt=''
        layout='fill'
        objectFit='scale-down'
        src={'https://cloudflare-ipfs.com/ipfs/' + card.artifact_uri.slice(7)}>
        </Image>
        </div>
        <p></p>
       
    <div className='bold'>{card.title}</div>
    <Link key={card.address} href={`/g/${card.creator.name || card.creator.address}`} passHref>
    <p>
    by:  <a> {card.creator.name || (card.creator.address.substr(0, 5) + "..." + card.creator.address.substr(-5))}
    </a>
    </p>
    </Link>
        <li> {card.description}</li>
        <p>{supply > 1 ? supply + ' editions' : ' single edition'} -  <a href={`https://hicetnunc.miami/objkt/${card.id}`} target="blank"  rel="noopener noreferrer">objkt#{card.id}</a></p>
        {/* <p>owned by: <a href={`https://hicetnunc.miami/tz/${ownedBy}`} target="blank" rel="noopener noreferrer">{name || ownedBy.substr(0, 5) + "..." + ownedBy.substr(-5) }</a></p> */}
         {supply && swaps?.status==0 ? <a onClick={handleCollect(swaps.id, swaps.price)}>{`collect for ${(swaps.price* 0.000001).toFixed(2)} tez`}</a> : 'not for sale'}
    </div>
    
  </>
)
}
export default Foto;