import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { connect, ConnectedProps } from 'react-redux'
import { Navigate } from "react-router-dom"

import 'react-toastify/dist/ReactToastify.css'
import SignStyle from "./Sign.module.css"

import { toggleLoggedIn, setData } from '../../../redux'
import { RootState, AppDispatch } from '../../../redux/store'
import { reducerSetDataTemplate } from '../../../redux/dataUser/reducer'
import { RequestSign, ResponseSign } from '../../../../../server/src/interface'

toast.configure();

const Sign: React.FC<Props> = (props: Props) => {
    const {
        isSign, 
        setSign, 
        difference: {title, question, ref}, 
        path, 
        loggedIn,
        toggleLoggedIn,
        setData
    } = props

    const initialStateName: string = ''
        , initialStatePassword: string = ''

    const [name, setName] = useState(initialStateName)
    const [password, setPassword] = useState(initialStatePassword)

    const submit = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        const request: RequestSign = {name, password}
        await fetch(`http://localhost:5000/api/sign/${path}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(request)
            })
            .then(res => res.json())
            .then((response: ResponseSign): ResponseSign => {
                if (response.data === undefined) {
                    return response
                }

                const { name, chats } = response.data

                type ChatPreview = Exclude<typeof response.data.chats[0], null>
                
                setData({
                    name, 
                    chats: chats.filter( (chat): chat is ChatPreview => chat !== null )
                })

                return response
            })
            .then((response: ResponseSign): ResponseSign => {
                toggleLoggedIn(response.isSuccess)
                notify(response)

                return response
            })
            .catch(error => console.log(error))
    }

    const notify = ({ message, isSuccess, errors }: ResponseSign): void => {
        if(isSuccess) {
            toast.success(message);
        } else {
            toast.error(message);
            errors && errors.forEach( err => { toast.error(err) } );
        }
    }

    const changeMode = ():void => {
        setSign(!isSign)
        
        setName(initialStateName)
        setPassword(initialStatePassword)
    }

    if (loggedIn) {
        return <Navigate to="/chat"/>
    }

    return (
        <div className={[ 'col', SignStyle.field ].join(' ')}>
            <h1>{title}</h1>
            <form onSubmit={submit}>
                <input 
                    type="text" 
                    placeholder="Enter your name"
                    onChange={event => setName(event.target.value)}
                    value={name}
                />
                <input 
                    type="password" 
                    placeholder="Enter your password"
                    onChange={event => setPassword(event.target.value)}
                    value={password}
                    autoComplete="on"
                />
                <input 
                    type="submit" 
                    value="Submit"
                    onClick={submit}
                />
            </form>
            <p>{question}<span onClick={() => changeMode()}>{ref}</span></p>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    loggedIn: state.loggedIn.reducerToggleLoggedIn.loggedIn,
    dataUser: state.dataUser
})

const dispatchToProps = (dispatch: AppDispatch) => ({
    toggleLoggedIn: (loggedIn: boolean) => dispatch( toggleLoggedIn(loggedIn) ),
    setData: (dataUser: reducerSetDataTemplate) => dispatch( setData(dataUser) )
})

const connector = connect(mapStateToProps, dispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(Sign)

interface Props extends PropsFromRedux {
    isSign: boolean
    setSign: React.Dispatch<React.SetStateAction<boolean>>
    difference: {
        title: string
        question: string
        ref: string
    }
    path: string
}