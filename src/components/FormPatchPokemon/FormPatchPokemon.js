import '../FormAddPokemon/formAddPokemon.css'
import './formPatchPokemon.css'
import React from 'react'
import {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import Loading from '../Loading/Loading'

function FormPatchPokemon({fetchTypes, decideTypeColor}) {
    const [pokemonName, setPokemonName] = useState("")
    const [description, setDescription] = useState(undefined)
    const [height, setHeight] = useState(undefined)
    const [weight, setWeight] = useState(undefined)
    const [checkedTypes, setCheckedTypes] = useState([])
    const [img_url, setImg_url] = useState(undefined)

    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [typesFromServer, setTypesFromServer] = useState([])
    const [pokemon, setPokemon] = useState({})
    const history = useHistory()
    const {id} = useParams() 

    const [psw, setPsw] = useState("")
    const [showPsw, setShowPsw] = useState(false)
    const password = "plsdontupdatety00"
 
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getTypes = async () => {
            const data = await fetchTypes()
            setTypesFromServer(data)
        }
        getTypes()

        const getPokemon = async () => {
            const pokeFromServer = await fetchPokemon()
            setPokemon(pokeFromServer)
        } 
        getPokemon().then(() => {
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        setPokemonName(pokemon.name)
        setDescription(pokemon.description)
        setWeight(pokemon.weight) 
        setHeight(pokemon.height)
        setImg_url(pokemon.img_url)
        // setCheckedTypes(pokemon.type)
    }, [pokemon])

    const fetchPokemon = async () => {
        const response = await fetch(`https://pokedex-api-minho.herokuapp.com/pokedex/pokemon/${id}`)
        const data = await response.json()
        return data
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(checkedTypes.length <1){
            setShowAlert(true)
            setAlertMessage('Pokémon must have at least 1 type')
            return
        }
        else if(psw !== password){
            return
        }
        const pokemon = { 
            name: pokemonName,
            description: description,
            height: height,
            weight: weight,
            type: checkedTypes.slice(0,2),
            img_url: img_url
        }
        console.log(pokemon)
        // Object.keys(pokemon).forEach((k) => pokemon[k] == undefined && delete pokemon[k]);
        setIsPending(true)
        fetch(`https://pokedex-api-minho.herokuapp.com/pokedex/pokemon/${id}/update`, {
            method: 'PATCH',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(pokemon)
        }).then((res) => {
            return res.json()
        }).then((newPokemon) => {
            console.log(newPokemon)
            history.push(`/pokemon/${id}`)
            setIsPending(false) 
        })
    }

    const handleCheckbox = (e) => {
        let currentTypes = checkedTypes
        if(currentTypes.includes(e.target.value)){
            let index = currentTypes.indexOf(e.target.value)
            currentTypes.splice(index, 1)
        } 
        else if(currentTypes.length === 2){
            setShowAlert(true)
            setAlertMessage("Pokemon must have a maximum of 2 types")
            currentTypes.push(e.target.value)
        } else{
            currentTypes.push(e.target.value)
        }
        setCheckedTypes(currentTypes)
    }
    if(isLoading){
        return <Loading/>
    } else{

        return (
            <form id = "pokemon-add-form"  onSubmit = {handleSubmit}>
                <div className = "flex-wrapper">
                    <label htmlFor = "name">Pokemon's Name:</label>
                    <input required value = {pokemonName}
                        onChange = {(e) => {setPokemonName(e.target.value)}}
                        type = 'text' id = "name" placeholder = "e.g. Godzilla, King Kong, Doge"  name='name'>
                    </input>
    
                    <label htmlFor = "description">Pokemon's Description:</label>
                    <input value = {description}
                        onChange = {(e) => {setDescription(e.target.value)}}
                        type = 'textarea' id = "description" placeholder = "optional"  name='description'>
                    </input>
    
                    <label htmlFor = "height">Pokemon's height (cm):</label>
                    <input value = {height}
                        onChange = {(e) => {setHeight(e.target.value)}}
                        type = 'number' id = "height"  name='height'>
                    </input>
    
                    <label htmlFor = "weight">Pokemon's weight (kg):</label>
                    <input value = {weight}
                        onChange = {(e) => {setWeight(e.target.value)}}
                        type = 'number' id = "name"  name='weight'>
                    </input>
                </div>
                <div className = 'flex-wrapper'>
                    {showAlert && <p id = "type-alert-msg">{alertMessage}</p>}
                    <fieldset>
                        <legend>Choose Types</legend>
                        {
                            typesFromServer.map(type => {
                                return (
                                    <div key = {type._id}>
                                        <input type = "checkbox" 
                                            //caused too much bug
                                            // checked = {
                                            //     pokemon.type && pokemon.type.map(checkedType => checkedType._id).includes(type._id)
                                            //     && "checked"}
                                            id = {decideTypeColor(type.name)}
                                            value = {type._id}
                                            onChange={handleCheckbox}>
                                        </input>
                                        <label htmlFor = {decideTypeColor(type.name)}
                                            className = {decideTypeColor(type.name)}
                                            >{type.name}
                                        </label> 
                                    </div>
                                )
                            })
                        } 
                    </fieldset>
    
                    <label htmlFor = "img_url">Pokemon's image URL:</label>
                    <input value = {img_url}
                        onChange = {(e) => {setImg_url(e.target.value)}}
                        type = 'text' id = "img_url" placeholder = "optional"  name='img_url'>
                    </input>
                    {/* {!isPending && <button>Update Pokemon</button>}
                    {isPending && <button disabled>Updating Pokemon...</button>} */}
                    {  
                        psw === password ? 
                        <button>
                            Update Pokemon
                        </button> : 
                        <button onClick = {() => setShowPsw(true)}>
                            Update Pokemon
                        </button>
                    }
                    {
                        showPsw && <div id = "psw-container-update">
                            <label for = "psw">Password for Updating Pokemon</label>
                            <input type = "password" id = "psw" value = {psw} onChange = {(e) => setPsw(e.target.value)}></input>
                        </div>
                    }
                </div>
            </form>
        )

    }
}

export default FormPatchPokemon