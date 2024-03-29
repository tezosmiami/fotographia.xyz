import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { usePassengerContext } from "../context/passenger-context";
import { LightButton } from './light-button';
import Link from 'next/link'

const hicdex ='https://api.hicdex.com/v1/graphql'

const querySubjkt = `
query Subjkt($address: String!) {
  hic_et_nunc_holder(where: {address: {_eq: $address}}) {
    name
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

  

export const Layout = ({children}) => {
    const app = usePassengerContext();
    const router = useRouter()  
    const [name,setName] = useState();


    useEffect(() => {
    async function fetchData() {
      if(app.address) {
        const { errors, data } = await fetchGraphQL(querySubjkt, 'Subjkt', { address: app.address});
       if (errors) {
         console.error(errors);
       }
       data?.hic_et_nunc_holder[0] && setName(data?.hic_et_nunc_holder[0].name);
     }
    }
    fetchData()
  }, [app])

 
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
    <header>
    <Link key={app.address} href={`/g/${name || app.address}`} passHref>
      {name || app.activeAccount && app.address.substr(0, 5) + "..." + app.address.substr(-5)}
      </Link>
  
      <button onClick={() => !app.activeAccount ? app.logIn() : app.logOut()}> 
        {!app.activeAccount ? "sync" : "unsync"}
      </button>  
    </header>  
    <p>
    <a className= 'bold' onClick={() => router.push('/')}>foto∙graphia.xyz</a>
    </p>
    <LightButton/>  
    {children}
    <footer>
    <p></p>
    <LightButton/>
    <p></p>
    <div style={{fontSize:'23px'}}>
    experimental dApp - enjoy! - and use at your own risk. . . 
    </div>
    </footer>
    
  </>
  )
}

