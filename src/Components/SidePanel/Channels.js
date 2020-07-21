import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions/';
import { Menu, MenuItem, Icon, Modal, ModalContent, Form, Input, FormField, Button, Label } from 'semantic-ui-react';

class Channels extends Component {

    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channel: null, 
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        typingRef: firebase.database().ref('typing'),
        notifications: [],
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
            // will take the id of every channel that is added to the channelsRef with snap.key
            this.addNotificationListener(snap.key);
        });
    };
    // it accepts snap.key as channelId 
    addNotificationListener = channelId => {
        // takes the messages ref as channelId  as a child on it and listen for a any value changes listens to any new messages added to any of our channels 
        this.state.messagesRef.child(channelId).on('value', snap => {
            // if we have a value for that channel prop within state if the user has change the channel they are on, its going to change the number of messages that are new in the other channels they are not on 
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        });
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        // iterate over the notifications arr we are getting from state w findIndex. 
        // we want to find the index value for an arr element within the notifications whichs  has an id that is equal to channel id 
        // basically we want to see if we have any info about a given channel
        let index = notifications.findIndex(notification => notification.id === channelId);
        // if we dont. if index is equal to neg one from findIndex...
        if(index !== -1) {
            // if we  have a index value for a given channel want to make sure its not equal to the channelId
            if(channelId !== currentChannelId) {
                // then we update the lastTotal vlaue using the total value from the given array element
                lastTotal = notifications[index].total;
                // then we'll get the most recent number of messages for a given channlel w/ snap.numChildren  - lastToal if is greater than 0 
                if(snap.numChildren() - lastTotal > 0) {
                    // theres a new message or multiple messages added to a given channel 
                    // we are going to update count prop with snap.numChildren - last total
                    // NUMBER OF NEW MESSAGES 
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            // we uodate the lastKnownTotal with snap.numChildren
            notifications[index].lastKnownTotal = snap.numChildren();
            // ...we want to push a new array element on to our notifications array 
        } else {
            notifications.push({
                id: channelId,
                // to get the total number of messages for a given channel 
                total: snap.numChildren(),
                //same value
                lastKnownTotal: snap.numChildren(),
                // initialize with 0 but updated to final total of notifications
                count: 0
            });
        }
        // when message listener has been executed after firing off a messagem we've run our conditional
        // update notifications arr in state
        this.setState({ notifications});
    };

    removeListeners = () => {
        this.state.channelsRef.off();
        this.state.channels.forEach(channel => {
            this.state.messagesRef.child(channel.id).off();
        })
    };

    //it will take first channel in array or channels and put it on GS 
    setFirstChannel = () => {
        //it takes the channels array and grab the first element 
        const firstChannel = this.state.channels[0];
        //if its out first time loading the page and if we have more than no channels, 
        if(this.state.firstLoad && this.state.channels.length > 0) {
            // we going to call set Current channel actoin and pass in the first channel
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
            // get notifications about new messages /o having to switch the channel
            this.setState({ channel: firstChannel });
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
        // when we change a channel we want to remove the typing ref for a given user
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove();
        this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    };

    // remove the notifications for a channel that we are currently on 
    clearNotifications = () => {
        // iterate over the notifications prop, findIndex and see if there is an id prop whose value is equal to the channel id
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);
        //if it finds a positive index number not equal to - one 
        if(index !== -1) {
            // we are ging to copy the notification arr in state and set ewual to variable iupdated notifications. 
            // we use spread opertaor to copy that arr 
            let updatedNotifications = [...this.state.notifications];
            // take updated notifications, select an element based on the indexx, grab the toal value of notifications and update by taking the notifications in state, slecting an element based on the index value that we found and updated it again with the last know total value 
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            // then we want to take the count prop and set equal to 0 
            updatedNotifications[index].count = 0;
            // set notifications in state with the new updated notifications 
            this.setState({ notifications: updatedNotifications });
        }
    };

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    };

    getNotificationCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if(notification.id === channel.id) {
                // we update the count prop on the notification element 
                count = notification.count;
            }
        });
        //return the number of new messages within the label component 
        if(count > 0) return count;
    };

    
    displayChannels = channels  => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7}}
                active={channel.id === this.state.activeChannel}
                >
                    {/* execute func, if value returned is true or truthy, display label  */}
                {this.getNotificationCount(channel) && (
                    // display number of new messages 
                    <Label color='red'>{this.getNotificationCount(channel)}</Label>
                )}    
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

export default connect(
    null, 
    { setCurrentChannel, setPrivateChannel }
    )(Channels); 