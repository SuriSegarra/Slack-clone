import React, { Component } from 'react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

export default class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        messages: '',
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        numUniqueUsers: ''
    };
    // TO check if we have a value in our gs for currentChannel and currentUser 
    componentDidMount() {
        const { channel, user } = this.state;

        if(channel && user) {
            this.addListeners(channel.id);
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }
// we're going to listen for any new messages added for a given channel 
    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false 
            });
            this.countUniqueUsers(loadedMessages);
        });
    };

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                //if it doesnt includea certain users name then well add it to our acc 
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const numUniqueUsers = `${uniqueUsers.length} users`;
        this.setState({ numUniqueUsers });
        }

    displayMessages = messages => {
      return  messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ));
    };

    displayChannelName = channel => channel ? `#${channel.name}` : '';

    render() {
        const { messagesRef, messages, channel, user, numUniqueUsers} = this.state;

        return (
            <React.Fragment>
                <MessagesHeader
                channelName={this.displayChannelName(channel)}
                numUniqueUsers={numUniqueUsers}
                />

                <Segment>
                    <Comment.Group className='messages'>
                    {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                />
            </React.Fragment>
        )
    }
}
