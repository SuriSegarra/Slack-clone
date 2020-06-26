import React, { Component } from 'react';
import { Menu, MenuItem, Icon } from 'semantic-ui-react';

export default class Channels extends Component {

    state = {
        channelss: []
    }

    render() {
        const { channelss } = this.state;

        return (
            <Menu.Menu style={{ paddingBottom: '2em' }}>
                <MenuItem>
                <span>
                    <Icon name='exchange'/> CHANNELsS
                </span>
                ({ channelss.length }) <Icon name='add'/>
                </MenuItem>
                {/* Channelss */}
            </Menu.Menu>
        )
    }
}
