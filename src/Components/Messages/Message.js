import React from 'react';
import moment from 'moment';
import { Comment, CommentAvatar, CommentContent, CommentAuthor, CommentMetadata, CommentText, Image } from 'semantic-ui-react';

// determine whether the ID of the user thats currently is the same as the ID of the user that created the message 
//if those 2 ids are the same will give it a class of message self otherwise no class 
const isOnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self' : '';
};

const isImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}
// it will taje the message time stamp whrn the message was created and converted it into a time from the current moment
const timeFromNow = timestamp => moment(timestamp).fromNow();

export default function Message({ message, user }) {
    return (
        <Comment>
            <CommentAvatar src={message.user.avatar}/>
            <CommentContent className={isOnMessage(message, user)}>
            <CommentAuthor as='a'>{message.user.name}</CommentAuthor>
            <CommentMetadata>{timeFromNow(message.timestamp)}</CommentMetadata>
            {isImage(message) ? 
                <Image src={message.image} className='message__image'/> : 
                <CommentText>{message.content}</CommentText>

            }
            </CommentContent>
        </Comment>
    )
}
