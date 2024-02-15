﻿import {React, useEffect, useState, useRef, useParams} from 'react'
import {Form, useActionData, useNavigation} from 'react-router-dom'

import "./content.css"

/* Sources:
 *  https://react.dev/reference/react/useEffect
 *  https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html
 */

function Responding() {
    var response = 0
    useEffect(() => {
    })
    return (
        <div className="content">
            Please watch the robot!
        </div>
    )
}

export async function action({ request, params }) {
    const data = Object.fromEntries(await request.formData())
    console.log("== action was called, data:", data)
    return fetch(
        "http://localhost:19931/command",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    )
}

function Game(props) {
    const {setResponding} = props
    const [command, setCommand] = useState(32)
    const megabool = false;
    const {state, formData} = useNavigation()
    return (
        <div className="content">
            <div className = "title">
                <div className = "caption">
                    Welcome to Sphero Simon!
                </div>
                <div className = "explanation">
                    Choose a color and make the robot GO!
                </div>
            </div>
            <div className = "buttons">
                {command == 1
                ? <button className="command red selected"/>
                : <button className="command red" onClick={() =>{setCommand(1)}}/>
                }
                {command == 2
                ? <button className="command green selected"/>
                : <button className="command green" onClick={() =>{setCommand(2)}}/>
                }
                {command == 3
                ? <button className="command blue selected"/>
                : <button className="command blue" onClick={() =>{setCommand(3)}}/>
                }
                {command == 4
                ? <button className="command orange selected"/>
                : <button className="command orange" onClick={() =>{setCommand(4)}}/>
                }
                {command == 5
                ? <button className="command purple selected"/>
                : <button className="command purple" onClick={() =>{setCommand(5)}}/>
                }
            </div>
            <Form method="POST">
                <input type="hidden" name="command" value={command}/>
                <button className="submit">GO</button>
            </Form>
            <div className = "spacer"/>
            {state == "submitting"
            ? <div className = "robocheck">Watch the Robot Go!</div>
            : <></>
            }
            
        </div>
    )
}


export function SpheroSimon(props) {
    const [responding, setResponding] = useState(false)
    if (responding == 1) {
        return <Responding/>;
    } else{
        return <Game setResponding={setResponding}/>;
    }
}