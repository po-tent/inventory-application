import React from 'react'
import {useState, useEffect} from 'react'
import './formAddPokemon.css' 
import {useHistory} from 'react-router-dom' 
 
function FormAddPokemon({fetchTypes, decideTypeColor}) {
    const [pokemonName, setPokemonName] = useState("")
    const [description, setDescription] = useState(undefined) //ezzel csináláni vmit, remove obj properties if .trim().length === 0
                                                    //conditional rendering direktben a pokemon objectben?
    const [height, setHeight] = useState(undefined)
    const [weight, setWeight] = useState(undefined) 
    const [checkedTypes, setCheckedTypes] = useState([])
    const [img_url, setImg_url] = useState(undefined)

    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [typesFromServer, setTypesFromServer] = useState([])
    const history = useHistory()

    useEffect(() => {
        const getTypes = async () => {
            const data = await fetchTypes()
            setTypesFromServer(data)
        }
        getTypes()
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault()
        if(checkedTypes.length <1){
            setShowAlert(true)
            setAlertMessage('Pokémon must have at least 1 type')
            return
        } else{
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
            fetch('https://pokedex-api-minho.herokuapp.com/pokedex/pokemon/create', {
                method: 'POST',
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify(pokemon)
            }).then((res) => {
                return res.json()
            }).then((newPokemon) => {
                console.log(newPokemon)
                history.push(`/pokemon/${newPokemon._id}`)
                setIsPending(false)
            })
        }
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

    return (
        <form id = "pokemon-add-form" onSubmit = {handleSubmit}>
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
                {!isPending && <button>Add Pokemon</button>}
                {isPending && <button disabled>Adding Pokemon...</button>}
            </div>
        </form>
    )
}

export default FormAddPokemon
