import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { useRouter } from 'next/router'
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

const getSearch = `
query querySearch($word: String!) {
  tags: hic_et_nunc_token(where: {mime: {_ilike: "%image%", _neq: "image/gif"}, supply: {_neq: "0"}, _and: [{token_tags: {tag: {tag: {_ilike: "%photo%"}}}}, {token_tags: {tag: {tag: {_eq: $word}}}}]}, order_by: {id: desc}) {
    id
    display_uri
    artifact_uri
    creator {
      address
      name
    }
  }
  aliases: hic_et_nunc_token(where: {mime: {_ilike: "%image%", _neq: "image/gif"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_ilike: "%photo%"}}}, creator: {name: {_eq: $word}}}, order_by: {id: desc}) {
    id
    display_uri
    artifact_uri
    creator {
      address
      name
    }
  }
}`;


export const Search = ({ returnSearch, query }) => {
    const [search, setSearch] = useState(query?.toLowerCase())
    const [input, setInput] = useState()
    const [loading, setLoading] = useState()
    const [fotos, setFotos] = useState()
    const router = useRouter();

    const handleKey = (e) => {
        if (e.key == 'Enter') { 

            e.preventDefault()
            setSearch(e.target.value.toLowerCase())
            setInput('')
        }
     
    }

    useEffect(() => {
    const getFotos = async() => {
        if (search) { 
        setFotos([])
        setLoading(true)  
        router.push(`/?search=${search}`, undefined, {shallow: true});
        const result = await request(hicdex,  getSearch, {word: search})
        const axios = require('axios');
        const banned = await axios.get('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json') ;
        const aliases = result.aliases.filter((i) => !banned.data.includes(i.artist_address))
        const tags = result.tags.filter((i) => !banned.data.includes(i.artist_address))
        const tags_artifacts = new Set(tags.map(({ artifact_uri }) => artifact_uri));
        const total = [
          ...tags,
          ...aliases.filter(({ artifact_uri }) => !tags_artifacts.has(artifact_uri))
        ];
        setFotos(total)
        // returnSearch(total)
      
         setLoading(false); 
        }
        }
        getFotos();
    }, [search])
    const isArtist = fotos?.every((i) => i.creator?.name === search)
    // if (search && !loading) return (<div>empty return. . .</div>)
    // if (loading) return 'loading. . .'
  
    return(
  <>
  
    <div style={{marginTop: '27px', width: '90vw'}}>
        <input
        className='searchbar'
        type="text"
        name="search"
        value={input  ?? ""}
        onInput={e => setInput(String(e.target.value))}
        label="search ↵"
        placeholder="search ↵"
        onKeyPress={handleKey}
      />
    </div>
    {loading && search && <div style={{marginTop:'18px'}}> searching: {search}. . .<p/></div> }
    {query && fotos?.length > 0 ? <div style={{marginTop: '18px'}}> {isArtist ? <Link href={`/g/${search}`} passHref>{search}</Link> : search}</div> :
     !loading && query && fotos ? <div style={{marginTop: '18px'}}> nada. . .<p /> </div> : null} 
    {query &&
    <Masonry
        breakpointCols={breakpointColumns}
        className='grid'
        columnClassName='column'>
    {fotos?.map(f=> (
      <Link key={f.id} className='center' href={`/foto/${f.id}`} passHref>
        <img alt='' className= 'pop' key={f.artifact_uri+f.token_id}  src={`https://ipfs.io/ipfs/${f.display_uri ? f.display_uri?.slice(7) : f.artifact_uri.slice(7)}`}/>
      </Link>
     ))}
  </Masonry>} 
      
       </>
    );
  }
  
  export default Search;