import React from 'react';
import firebase from '../../firebase';
import { Grid, GridColumn, GridRow, Header, HeaderContent, Icon, Dropdown } from 'semantic-ui-react';

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
        // console.log(this.props.currentUser);
        return (
            <Grid style={{ background: '4c3c4c' }}> 
                <GridColumn>
                    <GridRow style={{ padding: '1.2rem', margin: 0 }}>
                        {/*  app header */}
                        <Header inverted floated='left' as='h2'>
                            <Icon name='code'/>
                            <HeaderContent>DevChat</HeaderContent>
                        </Header>
                    </GridRow>

                    {/* user dropdown */}
                    <Header style={{ padding: '0.25rem' }} as='h4' inverted>
                        <Dropdown trigger={
                            <span>{this.state.user.displayName}</span>
                        } options={
                            this.dropdownOptions()
                        }/>
                    </Header>
                </GridColumn>
            </Grid>
        )
    }
}


export default UserPanel;