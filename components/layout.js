import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { usePassengerContext } from "../context/passenger-context";
import { LightButton } from './light-button';
import Link from 'next/link';


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
    <Head>
    </Head>
    <header>
    <Link key={app.address} href={`/g/${name || app.address}`} passHref>
        {/* <a className='name'> */}
      {name || app.activeAccount && app.address.substr(0, 5) + "..." + app.address.substr(-5)}
      {/* </a>  */}
    </Link>
  
      <button className='name glitch' data-text="hicetnunc"  onClick={() => !app.activeAccount ? app.logIn() : app.logOut()}> 
        {!app.activeAccount ?  's̶̨̫͙͙̗͂͗̌̈̏̚͝y̶̭̹͎̫̜͖̠̏͂̓͌̃̀́̕̕͜n̵̡̾͝ç̷̥̖̟̙̤͇͕͌̇̄̀͂̄ͅ' : `ů̵̝̅͒̇̒̒̆͂́ņ̶̢͖͙͙͍̦̀́̾̑̕̕͜͠ś̷̤̰̳̖͚̅̓́y̵̤̦͎̞̻̳͈͗̒̃̋͋̋͐̐n̵͖̞͍̍c̸̙͔̱̪͖̼̠͂̈́̀͒̓̿͜͠
̸̡̧̤̪̮̖̪̙͂̕`}
      </button>  
    </header>  
    <p>
    <a className='bold' onClick={() => router.push('/')}>g̶l̴e̸t̶c̵h̴a̸r̵d̴.̶x̵y̵z̶</a>
    </p>
    <LightButton/>  
    {children}
    <footer>
    <p></p>
    <p></p>
    <p></p>
    <LightButton/>
    <p></p>
    <div>
    experimental dApp - enjoy! - and use at your own risk. . . 
    </div>
    </footer>
    
  </>
  )
}

