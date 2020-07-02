import React, { Component } from 'react';
import { Modal, Icon, Input, Button, ModalHeader, ModalContent, ModalActions } from 'semantic-ui-react';

export default class FileModal extends Component {
    render() {
        const { modal, closeModal } = this.props;

        return (
            <Modal basic open={modal} onClose={closeModal}>
                <ModalHeader>Select an Image File</ModalHeader>
                <ModalContent>
                    <Input
                        fluid
                        label='File typesL jpg, png'
                        name='file'
                        type='file'
                    />
                </ModalContent>
                <ModalActions>
                    <Button
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
