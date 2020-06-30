import React, {Component} from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

export default class MessagesHeader extends Component {
    render() {
        return (
            //clearing: clear floated content.
            <Segment clearing>
                {/* channel title */}
                <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
                    <span>
                    Channel
                    <Icon name={'star outline'} color='black'/>
                    </span>
                    <Header.Subheader> 2 Users </Header.Subheader>
                </Header>

                {/* channel search input */}
                <Header floated='right'>
                    <Input
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
