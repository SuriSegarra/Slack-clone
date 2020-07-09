import React, { Component } from 'react';
import firebase from '../../firebase';
import { Menu, Icon } from 'semantic-ui-react';

export default class DirectMessages extends Component {
    state = {
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('info/connected'),
        presenceRef: firebase.database().ref('presence')
    } 

    componentDidMount() {
        if(this.state.user) {
            this.addListener(this.state.user.uid)
        }
    }

    addListener = currentUserUid => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });

        // addListeners = currentUserUid => {
        //     let loadedUsers = [];
        //     this.state.usersRef.on("child_added", snap => {
        //       if (currentUserUid !== snap.key) {
        //         let user = snap.val();
        //         user["uid"] = snap.key;
        //         user["status"] = "offline";
        //         loadedUsers.push(user);
        //         this.setState({ users: loadedUsers });
        //       }
        //     });
//give us better info about each user in our app
        this.state.connectedRef.on('value', snap => {
            if(snap.val() === true) {
               const ref =  this.state.presenceRef.child(currentUserUid);
               ref.set(true);
               //if our user disconnects from the app will remove it with the remove method 
               ref.onDisconnect().remove(err => {
                if(err !== null) {
                    console.error(err);
                }
               })
            }
        });
        // tracking the users online status with the presence ref .
        // if theres a new child added, a new user is added to our presence 
        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUid !== snap.key) {
                this.addListener(snap.key);
            }
        });

//listens when a child is removed to the presence ref 
        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUid !== snap.key) {
                //indicating the user is not connected and give them status of offline 
                // when a child is removed, we send rhe connected argument to false 
                this.addListener(snap.key, false);
            }
        });
    }

    addStatusToUser = ( userId, connected = true ) => {
        // it will go to the users array, iterate over each user value 
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                // if a connected value is passed a value of true, if so, put status as online if not will make them offline 
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);
        }, []);
        // set users with updated users arr
        this.setState({ users: updatedUsers });
    };

    isUserOnline = user => user.status === 'online';

    render() {
        const { users } = this.state;

        return (
           <Menu.Menu className='menu'>
               <Menu.Item>
                   <span>
                       <Icon name='mail'/> DIRECT MESSAGES
                       {/* to space from parentesis  */}
                   </span> {' '}
                   ({ users.length })
               </Menu.Item>
               {/* users to send DM */}
               {/* iterate over the users and all user data*/}
               {users.map(user => (
                   <Menu.Item
                    key={user.uid}
                    onClick={() => console.log(user)}
                    stye={{ opacity: 0.7, fontStyle: 'italic' }}
                   >
                       <Icon
                        name='circle'
                        color={this.isUserOnline(user) ? 'green' : 'red' }
                       />
                       @ {user.name}
                   </Menu.Item>
               ))}
           </Menu.Menu>
        )
    }
}
