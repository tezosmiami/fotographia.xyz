import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'


import Masonry from 'react-masonry-css'


const breakpointColumns = {
  default: 6,
  1800: 6,
  1500: 5,
  1200: 4,
  900: 3,
  600: 2
};

const getSearch = `
query querySearch($tag: String!, $search: String!) {
 hic_et_nunc_token(where: {mime: {_ilike: "%image%", _neq: "image/gif"}, supply: {_neq: "0"}, token_tags: {tag: {tag: {_eq: $tag, _eq: $search}}}}, order_by: {id: desc})  {
  id
  display_uri
  artifact_uri
  creator {
    address

  }
}
}`;


export const Search = ({returnSearch, query, banned}) => {
    const [search, setSearch] = useState(query?.toLowerCase())
    const [input, setInput] = useState()
    const [loading, setLoading] = useState()
    const [objkts, setObjkts] = useState()



    const handleKey = (e) => {
        if (e.key == 'Enter') { 
            setSearch(e.target.value.toLowerCase())
            setInput('')
        }
     
    }

    useEffect(() => {
    const getObjkts = async() => {
        if (search && banned) { 
        setObjkts([])
        setLoading(true)  
        const result = await request(process.env.REACT_APP_TEZTOK_API,  getSearch, {word: search,offset: offset})
        const aliases = result.aliases.filter((i) => !banned.includes(i.artist_address))
        const tags = result.tags.filter((i) => !banned.includes(i.artist_address))
        const tags_artifacts = new Set(tags.map(({ artifact_uri }) => artifact_uri));
        const total = [
          ...tags,
          ...aliases.filter(({ artifact_uri }) => !tags_artifacts.has(artifact_uri))
        ];
        setObjkts(total)
        returnSearch(total)
        navigate({
            pathname: '/',
            search: `search=${search}`,
            replace: false
          });
         setLoading(false); 
        }
        }
        getObjkts();
    }, [search,banned, offset])
    const isArtist = objkts?.every((i) => i.artist_profile?.alias === search)
    // if (search && !loading) return (<div>empty return. . .</div>)
    // if (loading) return 'loading. . .'

    return(
  <>
    <div className='container'>
      <p></p>
    <div>
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
    <p/>  
    {loading && search && <div> searching: {search}. . .<p/></div> }
    {query && objkts?.length > 0 ? <div className='inline'> {isArtist ? <Link to={`/${search}`}> &nbsp;{search}</Link> : search} </div> :
     !loading && query && objkts ? <div> nada. . .<p /> </div> : null} 
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
        </div>
       </>
    );
  }
  