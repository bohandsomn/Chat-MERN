import React from 'react'

import StaticStyle from './Static.module.css'

const Static: React.FC = () => {
    return (
        <div className={[ 'col', StaticStyle.static ].join(' ')}>
            <div className={StaticStyle.wrap}>
                <h1>Welcome</h1>
                <p>Thanks for visiting our service. < br />To start a chat you must be logged in</p>
            </div>
        </div>
    )
}

export default Static;