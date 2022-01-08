import React, { useState } from 'react'

import DevToolsStyle from './DevTools.module.css'
import { useDebounce } from '../../../hooks'

import { RequestGetUsers, ResponseGetUsers } from '../../../../../server/src/interface'

const ListOfUsers: React.FC<Props> = ({ listOfUsers, setListOfUsers }: Props) => {
    const initialStateUserCandidate: string = ''
        , initialStateUsers: string[] = []

    const [userCandidate, setUserCandidate] = useState(initialStateUserCandidate)
    const [users, setUsers] = useState(initialStateUsers)

    const getUsersFromDB = useDebounce(
        async () => {
            const request: RequestGetUsers = { user: userCandidate }
            await fetch('http://localhost:5000/api/chat/get-users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(request)
            })
                .then(response => response.json())
                .then((response: ResponseGetUsers) => {                
                    setUsers(response.users)
                    return response
                })
                .catch(error => console.log(error))
        }, 
        500
    )

    const addUserToList = (user: string) => 
        (event: React.SyntheticEvent): void => {
            event.preventDefault()

            const userInList = listOfUsers.includes(user)
            const notEmpty = user === ''

            if (userInList || notEmpty) {
                return
            }

            setListOfUsers([...listOfUsers, user])
        }

    const removeUserFromList = (currentNameUser: string): void => {
        setListOfUsers(listOfUsers.filter( userNameInList => userNameInList !== currentNameUser ))
    }

    const changeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUserCandidate(event.target.value)
        getUsersFromDB()
    }

    return (
        <div>
            {listOfUsers.length !== 0 && <datalist className={DevToolsStyle.list}>
                {listOfUsers.map( user => 
                    <option 
                        key={`${user}_listOfUsers`}
                        className={DevToolsStyle['list-item']}
                        onClick={() => removeUserFromList(user)}
                    >
                        {user}
                    </option>
                )}
            </datalist>}
            <form>
                <input 
                    type="text"
                    value={userCandidate}
                    onChange={changeInput}
                    placeholder='Add user to chat'
                />
                {users.length !== 0 && <datalist className={DevToolsStyle.list}>
                    {users.map( (user) => 
                        <option 
                            key={`${user}_users`}
                            className={DevToolsStyle['list-item']}
                            onClick={addUserToList(user)}
                        >
                            {user}
                        </option>
                    )}
                </datalist>}
            </form>
        </div>
    )
}

export default ListOfUsers;

interface Props {
    listOfUsers: string[]
    setListOfUsers: React.Dispatch<React.SetStateAction<string[]>>
}