import './App.css';
import {useState, useEffect} from 'react'
import Navbar from './Navbar/Navbar'
import PokemonCard from './PokemonCard/PokemonCard'
import FormPatchType from './FormPatchType/FormPatchType';
import TypeDetails from './TypeDetails/TypeDetails'
import PokemonDetails from './PokemonDetails/PokemonDetails'
import Loading from './Loading/Loading'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {Link} from 'react-router-dom'
import FormAddPokemon from './FormAddPokemon/FormAddPokemon'
import FormAddType from './FormAddType/FormAddType'
import FormPatchPokemon from './FormPatchPokemon/FormPatchPokemon';

function App() {
  const [types, setTypes] = useState([])
  const [showTypes, setShowTypes] = useState(true)
  const [pokemons, setPokemons] = useState([])

  useEffect(() => {
      const getTypes = async () => {
          const types = await fetchTypes()
          setTypes(types)
      }
      getTypes()

      const getPokemons = async () => {
        const pokemons = await fetchPokemons()
        setPokemons(pokemons)
      }
      getPokemons()
  }, [types])

  const fetchTypes = async ()=>{
      const res = await fetch('https://pokedex-api-minho.herokuapp.com/pokedex/types')
      const data = await res.json()
      return data
  } 

  const fetchPokemons = async () => {
    const res = await fetch('https://pokedex-api-minho.herokuapp.com/pokedex/pokemons')
    const data = await res.json()
    return data
  }

  //as we can update the type name, it is smarter to use the id, or type data could include the color in rgb
  function decideTypeColor (name){
    switch (name){
      case 'fire':
        return 'fire-type'
      case 'water':
        return 'water-type'
      case 'grass':
        return 'grass-type'
      case 'poison':
        return "poison-type"
      case 'flying':
        return 'flying-type'
      case 'electric':
        return 'electric-type'
      case 'bug':
        return 'bug-type'
      case 'normal':
        return 'normal-type'
      case 'ground':
        return 'ground-type'
      case 'fairy':
        return 'fairy-type'
      case 'fighting':
        return 'fighting-type'
      case 'dragon':
        return 'dragon-type'
      case 'ghost':
        return 'ghost-type'
      case 'rock':
        return 'rock-type'
      case 'ice':
        return 'ice-type'
      case 'psychic':
        return 'psychic-type'
      default:
        return 'default-color'
    }
  }

  return (
    <>
    <Router>
      <Navbar showTypes = {showTypes} setShowTypes = {setShowTypes}/>
      <ul id = "type-container">
          {
            showTypes && types.map(type => {
                return <Link to = {`/type/${type._id}`} style={{ textDecoration: 'none', color:'black'}} key = {type._id}>
                        <li className = {decideTypeColor(type.name)}
                          key = {type._id}>
                          {type.name}
                          </li>
                      </Link>
            })
          }
          {showTypes && <Link to = '/type/create' > {/*sikeres submit után redirect! */}
              <button id = "add-type-btn">+ Add Type</button> 
          </Link>}
        </ul>
        <article>
          <Switch>
            <Route exact path = {['/', '/Pokedex-React-Frontend']}>
              {pokemons.length > 0 ? 
                pokemons.map(pokemon => {
                  return <PokemonCard key = {pokemon._id} pokemon = {pokemon} decideTypeColor = {decideTypeColor} />
                }) :
                <Loading/>}
            </Route>
            <Route exact path = "/type/create">
              <FormAddType/>
            </Route>
            <Route exact path = '/type/:id/update'>
                <FormPatchType />
            </Route>
            <Route exact path = '/type/:id'>
                <TypeDetails decideTypeColor = {decideTypeColor}/>
            </Route>
            <Route exact path = "/pokemon/create">
              <FormAddPokemon decideTypeColor = {decideTypeColor} fetchTypes = {fetchTypes}/>
            </Route>
            <Route exact path = '/pokemon/:id/update'>
                <FormPatchPokemon decideTypeColor = {decideTypeColor} fetchTypes = {fetchTypes}/>
            </Route>
            <Route exact path = '/pokemon/:id'>
              <PokemonDetails  decideTypeColor = {decideTypeColor}/>
            </Route>
          </Switch>
        </article>
      </Router>
    </>
  );
}

export default App;
