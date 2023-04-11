import React from 'react'
import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import './formAddType.css'
import {CgPokemon} from 'react-icons/cg'
function FormAddType() {

    const [typeName, setTypeName] = useState("")
    const [isPending, setIsPending] = useState(false)
    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsPending(true)
        const type = {name: typeName}

        fetch('https://pokedex-api-minho.herokuapp.com/pokedex/type/create', {
            method: 'POST',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(type)
        }).then(() => {
            setIsPending(false)
            history.push('/')
        })
    }

    return (
        <form id = "type-add-form" onSubmit = {handleSubmit}>
            <label htmlFor = "name">Type name: </label>
            <input 
                required
                value = {typeName}
                onChange = {(e) => {
                    e.preventDefault()
                    setTypeName(e.target.value)
                }}
                type = 'text' id = "name" placeholder = "e.g. Earth, Wind, Fire"  name='name'>
            </input>
            {!isPending && <button type = "submit"> <CgPokemon/> Add Type</button> }
            {isPending && <button type = "submit" disabled><CgPokemon/> Adding Type... </button> }
        </form>
    )
}

export default FormAddType
