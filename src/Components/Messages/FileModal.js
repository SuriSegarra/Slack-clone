import React, { Component } from 'react';
import mime from 'mime-types';
import { Modal, Icon, Input, Button, ModalHeader, ModalContent, ModalActions } from 'semantic-ui-react';

export default class FileModal extends Component {
    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    };

    addFile = e => {
        //will select the first element with the index of 0 
        const file  = e.target.files[0];
        if(file) {
            //if theres is a value for this file variable, we're going to set the state 
            this.setState({ file });
        }
    };

    sendFile = () => {
        const { file } = this.state;
        const { uploadFile, closeModal } = this.props
        if(file !== null) {
            if(this.isAuthorized(file.name)) {
                //send file 
                const metadata = { contentType: mime.lookup(file.name) };
                uploadFile(file, metadata);
                closeModal();
                this.clearFile();
            }
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

    clearFile = () => this.setState({ file: null });

    render() {
        const { modal, closeModal } = this.props;

        return (
            <Modal basic open={modal} onClose={closeModal}>
                <ModalHeader>Select an Image File</ModalHeader>
                <ModalContent>
                    <Input
                        onChange={this.addFile} 
                        fluid
                        label='File typesL jpg, png'
                        name='file'
                        type='file'
                    />
                </ModalContent>
                <ModalActions>
                    <Button
                        onClick={this.sendFile}
                        color='green'
                        inverted
                    >
                        <Icon name='checkmark'/> Send
                    </Button> 

                     <Button
                        color='red'
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name='remove'/> Cancel
                    </Button>    
                </ModalActions>
            </Modal>
        )
    }
}