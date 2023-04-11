import './navbar.css'
import React from 'react'
import {AiFillGithub} from 'react-icons/ai'
import {ImCross} from 'react-icons/im'
import {GoThreeBars} from 'react-icons/go'
import {Link} from 'react-router-dom'
import {SiPokemon} from 'react-icons/si'

function Navbar({showTypes, setShowTypes}) {
    return (
        <>
        <nav>
            <Link to = '/pokemon/create'> {/*ez majd react link lesz, sikeres submit után redirect! */}
                <button id = "add-pokemon-btn">+ Pokemon</button>
            </Link>
            <Link to = '/'><img src = "https://i.imgur.com/MHIviTb.png" alt = "pokemon"/></Link>
            <a href = 'https://github.com/minho-sama/Pokedex-React-Frontend' target = '_blank' rel="noreferrer"><AiFillGithub id = "git-icon" size = "40px"/></a>
            <button id = "menu-button" onClick = {() => setShowTypes(!showTypes)}>
                {showTypes ?  <ImCross size = "23px"/>
                             : <GoThreeBars size = "23px"/>}
            </button>
        </nav>
        </>
    )
}

export default Navbar
