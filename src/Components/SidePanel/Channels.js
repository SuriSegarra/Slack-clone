import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions/';
import { Menu, MenuItem, Icon, Modal, ModalContent, Form, Input, FormField, Button } from 'semantic-ui-react';

class Channels extends Component {

    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true
    };

    componentDidMount() {
        this.addListeners();
    }
        //when we go to a different we will remove those listener that we set up so we're not listening for an event thats not going to take place 
    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
            
        });
    };

    removeListeners = () => {
        this.state.channelsRef.off();
    };

    //it will take first channel in array or channels and put it on GS 
    setFirstChannel = () => {
        //it takes the channels array and grab the first element 
        const firstChannel = this.state.channels[0];
        //if its out first time loading the page and if we have more than no channels, 
        if(this.state.firstLoad && this.state.channels.length > 0) {
            // we going to call set Current channel actoin and pass in the first channel
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel)
        }
        // we setState in order to set the first load to false 
        this.setState({ firstLoad: false });
    };

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

    changeChannel = channel => {
        //takes whichs channel we're passin to change the channel
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    };

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    
    displayChannels = channels  => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7}}
                active={channel.id === this.state.activeChannel}
                >
               # {channel.name}
                {/* {console.log(channel.name)} */}
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
                <Menu.Menu className='menu'>
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

export default connect(null, { setCurrentChannel, setPrivateChannel }
    )(Channels);