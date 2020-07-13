import React, { Component } from 'react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

export default class Messages extends Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        messages: '',
        messagesLoading: true,
        channel: this.props.currentChannel,
        isChannelStarred: false,
        user: this.props.currentUser,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
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
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false 
            });
            this.countUniqueUsers(loadedMessages);
        });
    };
// where all the private messages from private messages will be stored
    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        // if its a private channel, we're going to use private messages , otherwise messagesRef (public)
        return privateChannel ? privateMessagesRef : messagesRef;
    };

    handleSearchChange = e => {
        this.setState({
            searchTerm: e.target.value,
            searchLoading: true 
        }, () => this.handleSearchMessages());
    };

    handleStar = () => {
        this.setState(prevState => ({ 
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());
    };

    starChannel = () => {
        if(this.state.isChannelStarred) {
            console.log('star');
        } else {
            console.log('unstar');
        }
    };

    handleSearchMessages = () => {
        //we spread all the values messages and assign it to channelMessages to not mutate the original messages array 
        const channelMessages = [...this.state.messages];
        //g = global, match all instances of the pattern in a string, not just one i = case-insensitive
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) || 
                message.user.name.match(regex)
            ) {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
    };

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                //if it doesnt includea certain users name then well add it to our acc 
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
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

    displayChannelName = channel => {
        //if we pass a channle and then if so, check if is private, if so @, otherwise # for public channle 
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` :
        // if its not channel, return empty string
        '';
    };
    

    render() {
        const { messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader
                channelName={this.displayChannelName(channel)}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={this.handleSearchChange}
                searchLoading={searchLoading}
                isPrivateChannel={privateChannel}
                handleStar={this.handleStar}
                isChannelStarred={isChannelStarred}
                />

                <Segment>
                    <Comment.Group className='messages'>
                    {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm 
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef= {this.getMessagesRef}
                />
            </React.Fragment>
        )
    }
}
