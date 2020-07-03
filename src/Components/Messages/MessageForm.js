import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

import FileModal from './FileModal';

export default class MessageForm extends Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false
    };

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });


    handleChange = e => {
        //setting state according to the name of the input and give it the corresponding property
        this.setState({ [e.target.name]: e.target.value});
    };

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        }
        return message;
    }

    sendMessage = () => {
        //restructuring from props in order to create a message in our db 
        const { messagesRef } = this.props;
        //holds content of our messages
        const { message, channel } = this.state

        if(message) {
            this.setState({ loading: true })
            messagesRef
            // to specify which channels we are adding this messgae to 
            .child(channel.id)
            .push()
            .set(this.createMessage())
            .then(() => {
                this.setState({ loading: false, message: '', errors: [] })
            })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        // if we dont have a message...
        } else {
            this.setState({
                errros: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    };

    uploadFile = (file, metadata) => {
        console.log(file, metadata);
    }

    render() {
        const { errors, message, loading, modal } = this.state;

        return (
          <Segment className='message__form'>
              <Input
                fluid
                name='message'
                onChange={this.handleChange}
                value={message}
                style={{ marginBottom: '0.7em' }}
                label={<Button icon={'add'} />}
                labelPosition='left'
                className={
                    errors.some(error => error.message.includes('message')) ? 'error' : ''
                }
                placeholder='write your message'
              />
                <Button.Group icon widths='2'>
                    <Button
                        onClick={this.sendMessage}
                        disabled={loading}
                        color='orange'
                        content='Add Reply'
                        labelPosition='left'
                        icon='edit'
                    />
                    <Button
                        color='teal'
                        onClick={this.openModal}
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                    />
                </Button.Group>
          </Segment>
        )
    }
}
