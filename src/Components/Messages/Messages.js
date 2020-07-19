import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import Typing from './Typing';

class Messages extends Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        messages: '',
        messagesLoading: true,
        channel: this.props.currentChannel,
        isChannelStarred: false,
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        typingRef: firebase.database().ref('typing'),
        typingUsers: [],
        connectedRef: firebase.database().ref('.info/connected')
    };
    // TO check if we have a value in our gs for currentChannel and currentUser 
    componentDidMount() {
        const { channel, user } = this.state;

        if(channel && user) {
            this.addListeners(channel.id);
            this.addUserStarsListener(channel.id, user.uid)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.messagesEnd) {
            this.scrollTpBottom();
        }
    }

    scrollTpBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    };

    addListeners = channelId => {
        this.addMessageListener(channelId);
        this.addTypingListeners(channelId);
    };

    addTypingListeners = (channelId) => {
        // collects all the users typing within a given channel based on its id
        let typingUsers = [];

        this.state.typingRef.child(channelId).on("child_added", snap => {
            // makes sure that the snap.key is not the same as user uid. to make sure that we are not collecting the current auth user whithin this typing users arr
            if (snap.key !== this.state.user.uid) {
                typingUsers = typingUsers.concat({
                    // we are collecting the users id and their name and we are redesigning the typing users arr 
                    id: snap.key, 
                    name: snap.val()
                })

                this.setState({ typingUsers });
            }
        })

        this.state.typingRef.child(channelId).on("child_removed", snap => {
            // iterate over every user element, we want to compare the user id prop with snap key 
            const index = typingUsers.findIndex(user => user.id === snap.key)
            // if theres no index value that is positive
            if (index !== -1) {
                // if an index cant be found we use filter method wi;; iterate once again over the typingUsers arr to make sure that none of the ids whithin this elements is equal to snap.key
                typingUsers = typingUsers.filter(user => user.id !== snap.key)
                // and reassing typing user arr once again and set state 
                this.setState({ typingUsers })
            }
        })
        // listens to a value change
        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                this.state.typingRef
                .child(channelId)
                .child(this.state.user.uid)
                .onDisconnect()
                // when an authenticated user logs put their child value on the typingRef will be removed
                .remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                })
            }
        })
    };

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
            this.countUserPost(loadedMessages);
        });
    };
    // takes both values in order to get all of the channels and related information about the channels that the user has start
    addUserStarsListener = (channelId, userId) => {
        this.state.usersRef 
        // select child based on the user's id 
        .child(userId)
        // to get the entire start prop
        .child('starred')
        // to get its value 
        .once('value')
        // get data...
        .then(data => {
            // make sure we have a value for the starred prop
            if(data.val() !== null) {
                // get all the channels ID that a given user has saved and get an arr of them 
                const channelIds = Object.keys(data.val());
                // take arr of id and with includes method, see if our given channels ID is present within it 
                const prevStarred = channelIds.includes(channelId);
                // if it finds that within the arr it includes finds it rturn value of true and update channelStarred based on the previousStarred var
                this.setState({ isChannelStarred: prevStarred });
            }
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
            this.state.usersRef
            // select given child of that ref
            .child(`${this.state.user.uid}/starred`)
            // obj dynamically change the idea of the channel and it's related data
            .update({
                [this.state.channel.id]: {
                    // obj props
                    name: this.state.channel.name,
                    details: this.state.channel.details,
                    createdBy: {
                        name: this.state.channel.createdBy.name, 
                        avatar: this.state.channel.createdBy.avatar
                    }
                }
            });
        } else {
            // for every channel that we store we're adding a new channel ID with all the information about it 
            this.state.usersRef
            .child(`${this.state.user.uid}/starred`)
            .child(this.state.channel.id)
            .remove(err => {
                if (err !== null) {
                    console.error(err);
                }
            })
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

    countUserPost = messages => {
        let userPosts = messages.reduce((acc, message) => {
            // check to the body of produce wether there is a prop on the acc obj with the name of the current message user name if so were going to take the obj and increment its count by 1 
            if(message.user.name in acc) {
                acc[message.user.name].count += 1;
                // otherwise we are going to add a new obj on to the acc obj 
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    // since this is the forst time finding a message with the given username
                    count: 1
                }
            } return acc;
        }, {});
        // this action executes setUserPosts. this is to put it in GS
        this.props.setUserPosts(userPosts);
    };

    displayChannelName = channel => {
        //if we pass a channle and then if so, check if is private, if so @, otherwise # for public channle 
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` :
        // if its not channel, return empty string
        '';
    };

    displayTypingUsers = users => 
        users.length > 0 && users.map(user => (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2em' 
            }} key={user.id}>
                <span className='user__typing'> {user.name} is typing</span><Typing/>
            </div>
        ))

    render() {
        const { messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred, typingUsers } = this.state;

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
                    {searchTerm 
                    ? this.displayMessages(searchResults) 
                    : this.displayMessages(messages)}
                    {this.displayTypingUsers(typingUsers)}
                    <div ref={node => (this.messagesEnd = node)}></div>
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
};

export default connect(null, { setUserPosts })(Messages);
