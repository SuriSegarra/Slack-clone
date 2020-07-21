import React, {Component} from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

export default class MessagesHeader extends Component {
    render() {
        const { channelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel, handleStar, isChannelStarred } = this.props;

        return (
            //clearing: clear floated content.
            <Segment clearing>
                {/* channel title */}
                <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
                    <span>
                    {channelName}
                    {/* if its not a private channel, if it is a pubic channel only then will show the start icon  */}
                    {!isPrivateChannel && ( 
                    <Icon 
                         onClick={handleStar} 
                         name={isChannelStarred ? 'star' : 'star outline'} 
                         color={isChannelStarred ? 'yellow' : 'black'}
                    />
                    )}
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/* channel search input */}
                <Header floated='right'>
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size='mini'
                        icon='search'
                        name='searchTerm'
                        placeholder='Search Messages'
                    />
                </Header>
            </Segment>
        )
    }
}
