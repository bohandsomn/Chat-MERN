import React from 'react'

import CreateChat from './CreateChat'
import ChangeChat from './ChangeChat'
import DevToolsStyle from './DevTools.module.css'

const DevTools: React.FC = () => {
    return (
        <div className={DevToolsStyle.field}>
            <h1 className={DevToolsStyle.indent}>Developer tools</h1>
            <CreateChat />
            <ChangeChat />
        </div>
    )
}

export default DevTools;
