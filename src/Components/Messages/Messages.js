import React, { Component } from 'react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import { Segment, Comment } from 'semantic-ui-react';

export default class Messages extends Component {
    render() {
        return (
            <React.Fragment>
                <MessagesHeader/>

                <Segment>
                    <Comment.Group className='messages'>

                    </Comment.Group>
                </Segment>

                <MessageForm />
            </React.Fragment>
        )
    }
}
