import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
// allow to switch to other public channels and update those values in our global state and connect 
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, MenuItem, Icon } from 'semantic-ui-react';

class Starred extends Component {
    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        starredChannels: [],
        activeChannels: ''
    };

    componentDidMount() {
        // make sure that we first have a value in state for our current user 
        if(this.state.user) {
            // once we do, we can pass down their uid
            this.addListeners(this.state.user.uid);
        }
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
    };
    
// esto es para el starred area. el add y rmeove the starred channels
    addListeners = userId => {
        // will listen for the users ref for any new changes to the starred prop
        this.state.usersRef
        .child(userId)
        .child('starred')
        // we first we want to listen for when a user starts a new channel 
        .on('child_added', snap => {
            // assemble an obj with an id prop to snap.key and then spread all the values to get rest of props for a given channels info
            const starredChannel = { id: snap.key, ...snap.val() };
            this.setState({
                // creating a new arr, take all prev values of starred Channels and spread them in arr and add the new starredChannel Obj at the end
                starredChannels: [...this.state.starredChannels, starredChannel]
            });
        });
        // to listen for a channle is unstarred 
        this.state.usersRef
        .child(userId)
        .child('starred')
        // remove some channel info that was previously in our starredChannels arr
        .on(`child_removed`, snap => {
            const channelToRemove = { id: snap.key, ...snap.val() };
            // takes starredChannels arr and with filter method it makes sure this new array doesnt have an element that was an ID prop equal to the id of the channel to remove obj 
            const filteredChannels = this.state.starredChannels.filter(channel => {
                return channel.id !== channelToRemove.id;
            });
            // update the starredChannels arr in state to the filter channels arr  just created
            this.setState({ starredChannels: filteredChannels})
        });

    };

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    };

    changeChannel = channel => {
        //takes whichs channel we're passin to change the channel
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
    };

    displayChannels = starredChannels  => {
        return starredChannels.length > 0 &&    starredChannels.map(channel => (
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

    render() {
        const { starredChannels } = this.state;

        return (
            <Menu.Menu className='menu'>
                <MenuItem>
                    <span>
                        <Icon name='star'/> Starred 
                    </span>{' '}
                    ({ starredChannels.length }) 
                </MenuItem>
            {/* channels */}
            {this.displayChannels(starredChannels)}
        </Menu.Menu>
        )
    }
};


export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
