// includes info about the channel that users currently on
import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon } from 'semantic-ui-react';

export default class MetaPanel extends Component {
    state = {
        activeIndex: 0,
        privateChannel: this.props.isPrivateChannel
    };

    // when we click on a title, we're going to set the active index and therefore (por lo tanto)
    // give us access to the index that we set on title 
    setActiveIndex = (event, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        // give value of -1 otherwise the index thats being passed when we clikc a give part of the accordion
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
    };

    render() {
        const { activeIndex, privateChannel } = this.state;
        
        if (privateChannel) return null;

        return (
           <Segment>
               <Header as='h3' attached='top'>
                   About the # Channel
               </Header>
               <Accordion styled attached='true'>
                <Accordion.Title
                active={activeIndex === 0}
                index={0}
                onClick={this.setActiveIndex}
                >
                    <Icon name='dropdown' />
                    <Icon name='info' />
                    Channel Details
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    details 
                </Accordion.Content>

                <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={this.setActiveIndex}
                >
                    <Icon name='dropdown' />
                    <Icon name='user cirlce' />
                    Top Posters 
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    posters
                </Accordion.Content>

                <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={this.setActiveIndex}
                >
                    <Icon name='dropdown' />
                    <Icon name='pencil alternate' />
                   Created By 
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    creator 
                </Accordion.Content>
               </Accordion>
           </Segment>
        )
    }
}
