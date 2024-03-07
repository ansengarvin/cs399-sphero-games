﻿import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation, NavLink} from 'react-router-dom'

import { css } from '@emotion/react'
import { Board } from './spheropolyBoard'

export async function action({ request, params }) {
    const data = Object.fromEntries(await request.formData())
    console.log("== action was called, data:", data)
    if (data.phase == "start") {
        return fetch("http://localhost:19931/spheropoly/new",
        {
            method: "POST"
        })
    } else if (data.phase == "roll") {
        var roll = Math.floor(Math.random() * 6)
        return fetch(
            "http://localhost:19931/spheropoly/roll",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({roll: roll})
            }
        )
    } else if (data.phase == "tile") {
        if(data.owner == 0) {
            if (data.buy) {
                return fetch(
                    "http://localhost:19931/spheropoly/buy",
                    {
                        method: "POST"
                    }
                )
            } else {
                return fetch(
                    "http://localhost:19931/spheropoly/auction",
                    {
                        method: "POST"
                    }
                )
            }
        } else if (data.owner == 2) {
            return fetch(
                "http://localhost:19931/spheropoly/pay",
                {
                    method: "POST"
                }
            )
        } else {
            return fetch(
                "http://localhost:19931/spheropoly/continue",
                {
                    method: "POST"
                }
            )
        }
    } else {
        console.log("No phase selected.")
        return null
    }
}

function Start(props) {
    const {phase, setPhase, state, response} = props
    if (response && response.lastAction && response.lastAction == "start") {
        setPhase("roll")
    }
    return (
        <div className = "controls">
            <div className = "caption">
                Your turn!
            </div>
            <div className = "explanation">
                    Press the button to start the game.
            </div>
            <Form method="POST">
                <input type ="hidden" name="phase" value={phase}/>
                <button className="submit">Start</button>
            </Form>
        </div>
    ) 
}

function Roll(props) {
    const {phase, setPhase, state, response} = props
    if (response && response.lastAction && response.lastAction == "roll") {
        setPhase("tile")
    }
    return (
        <div className = "controls">
            <div className = "caption">
                Your turn!
            </div>
            <div className = "explanation">
                    {response.lastAction == "tile" && 
                    <>If the robot is not where they should be, please lend a hand and move them!<br/></>}
                    Press the button to roll the dice!
            </div>
            <Form method="POST">
                <input type ="hidden" name="phase" value={phase}/>
                <button className="submit"><i className="fa-solid fa-dice fa-2xl"></i></button>
            </Form>
        </div>
    )
}

function Tile(props) {
    const {phase, setPhase, state, response} = props
    const [buy, setBuy] = useState(false)
    if (response && response.lastAction && response.lastAction == "tile") {
        setPhase("roll")
    }
    console.log("Owner of this tile is", response.board[String(response.human.position)].owner)
    if (state == "idle"){
        return (
            <div className = "controls">
                <div className = "caption">
                    Your turn!
                </div>
                <div className = "explanation">
                        You rolled a {response.human.lastRoll}. Please move your piece, then choose the following.
                </div>
                <div className = "buttons">
                        { response.board[String(response.human.position)].owner == 0 && (buy == true 
                        ? <button className="command green selected">Buy</button>
                        : <button className="command green" onClick={() =>{setBuy(true)}}>Buy</button>)
                        }
                        { response.board[String(response.human.position)].owner == 0 && (buy == false
                        ? <button className="command red selected">Auction</button>
                        : <button className="command red" onClick={() =>{setBuy(false)}}>Auction</button>)
                        }
                        {response.board[String(response.human.position)].owner == 1
                        && <>You landed on your own tile! Press the button to move on.</>}
                        {response.board[String(response.human.position)].owner == 2
                        && <>Oh no! You landed on the robot's tile! Press the button to pay them!</>}
                        {response.board[String(response.human.position)].owner == -1
                        && <>You landed on federal property. This does nothing for now.</>}
                    </div>
                <Form method="POST">
                    <input type = "hidden" name="buy" value={buy}/>
                    <input type = "hidden" name="phase" value={phase}/>
                    <input type = "hidden" name="owner" value={response.board[String(response.human.position)].owner}/>
                    <button className="submit"><i class="fa-solid fa-check fa-2xl"></i></button>
                </Form>
            </div>
        )
    } else {
        return (
            <div className = "controls">
                <div className = "caption">
                    Please wait for the robot to finish its turn.
                </div>
                <div className = "explanation">
                    Press the button to buy or auction.
                </div>
            </div>
        )
    }

}

export function Spheropoly() {
    const [phase, setPhase] = useState("start")
    const {state} = useNavigation()
    const response = useActionData()

    console.log("phase:", phase)

    switch(phase) {
        case "start":
            return (
                <div className="content">
                    <div className="columns">
                        <Start phase = {phase} setPhase = {setPhase} state={state} response={response}/>
                        <div>
                            <Board data={response} state={state}/>
                        </div>
                    </div>
                </div>
            )
        case "roll":
            return (
                <div className="content">
                    <div className="columns">
                        <Roll phase = {phase} setPhase = {setPhase} state={state} response={response}/>
                        <div>
                            <Board data={response} state={state}/>
                        </div>
                    </div>
                </div>
            )
        case "tile":
            return (
                <div className="content">
                    <div className="columns">
                        <Tile phase = {phase} setPhase = {setPhase} state={state} response={response}/>
                        <div>
                            <Board data={response} state={state}/>
                        </div>
                    </div>
                </div>
            )
        default:
            return (
                <div className="content">
                    <div className="columns">
                        <div>
                            Under Development
                        </div>
                        <div>
                            <Board data={response} state={state}/>
                        </div>
                    </div>
                </div>
            )
            
    }
}