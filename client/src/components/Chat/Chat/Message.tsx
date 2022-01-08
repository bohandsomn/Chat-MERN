import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import MessageStyle from './Message.module.css'
import { getTime } from '../../../functions'
import { RootState, AppDispatch } from '../../../redux/store'
import { MessageTemplate } from '../../../../../server/src/interface'

const Message: React.FC<Props> = (props: Props) => {
    const {message: {content, senderName, time}, name} = props

    const stylesList = [MessageStyle.container]
    senderName === name && stylesList.push(MessageStyle.isender)

    return (
        <div className={stylesList.join(' ')}>
            <div className={MessageStyle['name-and-time']}>
                <h5>{senderName}</h5>
                <p>{getTime(time)}</p>
            </div>
            <p>{content}</p>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    name: state.dataUser.reducerSetData.name
});

const dispatchToProps = (dispatch: AppDispatch) => ({
});

const connector = connect(mapStateToProps, dispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface Props extends PropsFromRedux {
    message: MessageTemplate
}

export default connector(Message);