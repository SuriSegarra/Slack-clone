import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import './App.css';
import { connect } from 'react-redux';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor  }) => (
  <Grid columns='equal' className='app' style={{ background: secondaryColor }}>

    <ColorPanel
      key={currentUser && currentUser.name}
      currentUser={currentUser}

    />
    <SidePanel
      //uid unique identifier
      key={currentUser && currentUser.uid}
      currentUser={currentUser} 
      primaryColor={primaryColor}
    />

    <GridColumn style={{ marginLeft: 320 }}>
      <Messages 
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      />
    </GridColumn>

    <GridColumn width={4}>
      <MetaPanel 
        key={currentChannel && currentChannel.name}
        userPosts={userPosts}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
      />
    </GridColumn>
  </Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  // we need to know whether a given channel that we're in is in private and a number of places within our messages 
  isPrivateChannel: state.channel.isPrivateChannel,
  // to get current value of user posts from state that channel that user post 
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
})


export default connect(mapStateToProps)(App);
