import React, { Component } from 'react';
import { connect } from 'react-redux'
// allow to switch to other public channels and update those values in our global state and connect 
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, MenuItem, Icon } from 'semantic-ui-react';

class Starred extends Component {
    state = {
        starredChannels: [],
        activeChannels: ''
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
