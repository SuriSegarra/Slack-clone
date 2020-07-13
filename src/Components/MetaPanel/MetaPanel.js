// includes info about the channel that users currently on
import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon, Image } from 'semantic-ui-react';

export default class MetaPanel extends Component {
    state = {
        channel: this.props.currentChannel,
        privateChannel: this.props.isPrivateChannel,
        activeIndex: 0,
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
        const { activeIndex, privateChannel, channel } = this.state;
        // to hide metaPanel whenever we are in a private channel
        if (privateChannel) return null;

        // I was receiving channel is  null so I put this. The problem is the render and the firebase API. Is async by the time it comes up the first time, channel is undefined. so since it comes undifenied it comes as an error. 
        // if we dont have a channel, return null 
        // it takes a certain amount of time for in our GS the channel data to be said 
        return (
           <Segment loading={!channel}>
               <Header as='h3' attached='top'>
                   About the # {channel && channel.name}
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
                    {channel && channel.details}
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
                    <Image src={channel && channel.createdBy.avatar}/>
                    {channel && channel.createdBy.name} 
                </Accordion.Content>
               </Accordion>
           </Segment>
        )
    }
}
