import React from 'react'
import {useState, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {Link} from 'react-router-dom'
import PokemonCard from '../PokemonCard/PokemonCard'
import '../App.css'
import './typeDetails.css'

import Loading from '../Loading/Loading'

function TypeDetails({decideTypeColor}) {
  const {id} = useParams()
  const [type, setType] = useState({})
  const [pokemonsByType, setPokemonsByType] = useState([])

  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const history = useHistory()
 
  useEffect(() => {
    const getType = async () => {
      const typeFromServer = await fetchType(id)
      setType(typeFromServer.type)
      setPokemonsByType(typeFromServer.pokemons)
    }
    getType()
  }, [id])

  const fetchType = async (id) => {
    const response = await fetch(`https://pokedex-api-minho.herokuapp.com/pokedex/type/${id}`)
    const data = await response.json()
    return data
  }

  const handleDelete = () => {
    if(pokemonsByType.length > 0){
      setShowDeleteAlert(true)
      return 
    } else{
      fetch(`https://pokedex-api-minho.herokuapp.com/pokedex/type/${id}/delete`, {
        method: 'DELETE'
      }).then(() => {
        history.push('/')
      })
    }
  }

    return (
        <>
        <h1><span className = {decideTypeColor(type.name)}>{type.name}</span> type Pokemons:</h1>
        <div className = "type-controllers">
          <Link to = {`/type/${id}/update`}>
            <button>Update Type</button>
          </Link>
          <button onClick = {handleDelete}>Delete Type</button>
        </div>
        <article>
          { pokemonsByType.length > 0 ? 
            pokemonsByType.map(pokemon => {
              return (
                <PokemonCard pokemon = {pokemon} decideTypeColor = {decideTypeColor} key = {pokemon._id}/>
              )
            })
            : <Loading/>
          }
        </article>
        {
          showDeleteAlert && 
          <section id = "delete-alert">
          <h1>Please delete these pokemons before you delete {type.name}: </h1>
          <ul>
            {
              pokemonsByType.map(pokemon => {
                return <Link to = {`/pokemon/${pokemon._id}`} style={{ textDecoration: 'none' }}><li key = {pokemon._id}>{pokemon.name}</li></Link>
              })
            }
          </ul>
          <button onClick = {() => setShowDeleteAlert(false)} >
            close
          </button>
        </section>
        }
        </>
    )
}

export default TypeDetails
