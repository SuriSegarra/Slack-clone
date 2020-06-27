import React, { Component } from 'react';
import { Menu, MenuItem, Icon, Modal, ModalContent, Form, Input, FormField, Button } from 'semantic-ui-react';

export default class Channels extends Component {

    state = {
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.isFormValid(this.state)) {
            console.log('Channel added');
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    openModal = () => this.setState({ modal:true });

    closeModal = () => this.setState({ modal:false });

    render() {
        const { channels, modal } = this.state;

        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <MenuItem>
                    <span>
                        <Icon name='exchange'/> CHANNELS
                    </span>{' '}
                    ({ channels.length }) <Icon name='add' onClick={this.openModal}/>
                    </MenuItem>
                    {/* channels */}
                </Menu.Menu>

                {/* add channel modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>
                        Add a channel
                    </Modal.Header>
                    <ModalContent>
                        <Form onSubmit={this.handleSubmit}>
                            <FormField>
                                <Input
                                    fluid
                                    label='Name of Channel'
                                    name='channelName'
                                    onChange={this.handleChange}
                                />
                            </FormField>

                            <FormField>
                                <Input
                                    fluid
                                    label='About the channel'
                                    name='channelDetails'
                                    onChange={this.handleChange}
                                />
                            </FormField>
                        </Form>
                    </ModalContent>

                    <Modal.Actions>
                        <Button color='green' inverted
                        onClick={this.handleSubmit}>
                            <Icon name='checkmark'/>
                            Add
                        </Button>
                        <Button color='red' inverted
                        onClick={this.closeModal}>
                            <Icon name='remove'/>
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}
