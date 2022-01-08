import React, { useState } from 'react'

import Static from './Static'
import Sign from './Sign'

const Welcome: React.FC = () => {
    const [isSign, setSign] = useState<boolean>(false)
    return (
        <div className='d-flex flex-row'>
            < Static />
            {isSign 
            ?
                < Sign 
                    isSign={isSign} 
                    setSign={setSign} 
                    difference={{title: 'Sign In', question: 'Not a member yet? ', ref: 'Sign up!'}} 
                    path='sign-in'
                />
            :
                < Sign 
                    isSign={isSign} 
                    setSign={setSign} 
                    difference={{title: 'Sign Up', question: 'Have you already registered? ', ref: 'Sign in!'}} 
                    path='sign-up'
                />
            }
        </div>
    )
}

export default Welcome
export { Static, Sign }