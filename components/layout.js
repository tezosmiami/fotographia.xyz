import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { usePassengerContext } from "../context/passenger-context";
import { LightButton } from './light-button';
import Link from 'next/link'

const hicdex ='https://hdapi.teztools.io/v1/graphql'

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
       data.hic_et_nunc_holder[0] && setName(data.hic_et_nunc_holder[0].name);
     }
    }
    fetchData()
  }, [app])

  return (
    <>
    <header>
    <Link key={app.address} href={`/galerie/${name || app.address}`} passHref>
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
    {/* <Link href='/deal'>(=*\/*=)</Link> */}
    {children}
    <footer>
     <p>
    <LightButton/>
    </p>
    <div>
    experimental dApp - enjoy! - and use at your own risk. . . 
    </div>
    </footer>
    
  </>
  )
}

