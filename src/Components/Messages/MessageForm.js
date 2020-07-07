import React, { Component } from 'react';
import firebase from '../../firebase';
import uuidv4 from 'uuid/v4';
import { Segment, Button, Input } from 'semantic-ui-react';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

export default class MessageForm extends Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadTask: null,
        uploadState: '',
        percentUploaded: 0,
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

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };  
        if(fileUrl !== null) {
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message;
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
       const pathToUpload = this.state.channel.id;
       const ref = this.props.messagesRef;
       //unique id youll never be repeat 
       const filePath = `chat/public/${uuidv4()}.jpg`;

       this.setState({
           uploadState: 'uploading',
           uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
       },
       //listen to the percent of the file that was uploaded and set the state with that percentage 
        () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.setState({ percentUploaded })
            },
                err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })
                },
                () => {
                    this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                        this.sendFileMessage(downloadUrl, ref, pathToUpload);
                    })
                    .catch(err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        })
                    })
                }
            )
        }
       )
    };

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
        .push()
        .set(this.createMessage(fileUrl))
        .then(() => {
            this.setState({ uploadState: 'done' })
        })
        .catch(err => {
            console.error(err);
            this.setState({ 
                errors: this.state.errors.concat(err)
            })
        })
    }


    render() {
        //prettier-ignore
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;

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
                        disabled={uploadState === 'uploading'}
                        onClick={this.openModal}
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                </Button.Group>
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        uploadFile={this.uploadFile}
                    />
                    <ProgressBar 
                        uploadState={uploadState}
                        percentUploaded={percentUploaded}
                    />
          </Segment>
        )
    }
}
