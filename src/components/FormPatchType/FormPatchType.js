import React from 'react'
import {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import './formPatchType.css'
import {CgPokemon} from 'react-icons/cg'

function FormPatchType() {

    const [type, setType] = useState({})
    const [typeName, setTypeName] = useState("")
    const history = useHistory()
    const {id} = useParams()
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const getType = async () => {
            const typeFromServer = await fetchType()
            setType(typeFromServer)
            setTypeName(typeFromServer.type.name)
        }
        getType()
    }, [])

    const fetchType = async () => {
        const response = await fetch(`https://pokedex-api-minho.herokuapp.com/pokedex/type/${id}`)
        const data = await response.json()
        return data
      }

    const handleSubmit = (e) => {
        e.preventDefault()
        const type = {name: typeName}
        setIsPending(true)

        fetch(`https://pokedex-api-minho.herokuapp.com/pokedex/type/${id}/update`, {
            method: 'PATCH',
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(type)
        }).then(() => {
            setIsPending(false)
            history.push(`/type/${id}`)
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
            {!isPending && <button> <CgPokemon/> Update Type</button> }
            {isPending && <button disabled><CgPokemon/> Updating Type... </button> }
        </form>
    )
}

export default FormPatchType