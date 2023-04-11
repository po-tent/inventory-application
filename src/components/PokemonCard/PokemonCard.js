import React from 'react'
import './PokemonCard.css'
import {Link} from 'react-router-dom'
const uniqid = require('uniqid');

function PokemonCard({pokemon, decideTypeColor}) {
    return (
        <section>
            <Link to = {`/pokemon/${pokemon._id}`} style={{ textDecoration: 'none' }}>
                <img src = {pokemon.img_url === undefined ||
                            pokemon.img_url == null ? 
                            "https://i.imgur.com/IvobJfq.png" : 
                            pokemon.img_url
                        } 
                        // onError={`${pokemon.img_url}='https://i.imgur.com/IvobJfq.png`}
                    alt = {pokemon.name}/>
                <h1>{pokemon.name}</h1>
            </Link>
            <ul>
            {
                pokemon.type.map(type => {
                    return (
                        <li key = {uniqid()}
                        className = {decideTypeColor(type.name)}>
                        {type.name}
                        </li>
                    )
                })
            }
            </ul>
        </section>
    )
}

export default PokemonCard
