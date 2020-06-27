import React, { Component } from 'react';
import firebase from '../../firebase';
import { Menu, MenuItem, Icon, Modal, ModalContent, Form, Input, FormField, Button } from 'semantic-ui-react';

export default class Channels extends Component {

    state = {
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
    };

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels });
        })
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        //unique identifier for every new channel that is added
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setState({ channelName: '', channelDetails:'' });
            this.closeModal();
            console.log('channel added');
        })
        .catch(err => {
            console.log(err);
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    displayChannels = channels  => {
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => console.log(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
            >
                # {channel.name}
            </Menu.Item>
        ))
    }

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
                {this.displayChannels(channels)}
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
