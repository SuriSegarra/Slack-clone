import React from 'react';
import firebase from '../../firebase';
import { Grid, GridColumn, GridRow, Header, HeaderContent, Icon, Dropdown, Image } from 'semantic-ui-react';

class UserPanel extends React.Component {

    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text: (
                <span>Signed in as <strong>{this.state.user.displayName}</strong>
                </span>
                ),
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'sign out',
            text: <span onClick={this.handleSignOut}>Sign Out</span>
        }
    ];

    handleSignOut = () => {
firebase
.auth()
.signOut()
.then(() => console.log('signed out'));

    } 
    render() {

        const { user } = this.state;
      
        return (
            <Grid style={{ background: '4c3c4c' }}> 
                <GridColumn>
                    <GridRow style={{ padding: '1.2rem', margin: 0 }}>
                        {/*  app header */}
                        <Header inverted floated='left' as='h2'>
                            <Icon name='code'/>
                            <HeaderContent>DevChat</HeaderContent>
                        </Header>
                        
                        {/* user dropdown */}
                        <Header style={{ padding: '0.25rem' }} as='h4' inverted>
                            <Dropdown 
                                trigger={
                                <span>
                                <Image src={user.photoURL} spaced='right' avatar/>
                                {user.displayName}</span>} 
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </GridRow>
                </GridColumn>
            </Grid>
        )
    }
}


export default UserPanel;