import React from 'react';
import firebase from '../../firebase';
import { Grid, GridColumn, GridRow, Header, HeaderContent, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser,
        modal: false
    };

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

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
            text: <span onClick={this.openModal}>Change Avatar</span>
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

        const { user, modal } = this.state;
        const { primaryColor } = this.props
      
        return (
            <Grid style={{ background: primaryColor }}> 
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
                                {user.displayName}</span>
                                } 
                                options={this.dropdownOptions()}
                            />
                        </Header>
                    </GridRow>

                    {/* Change User Avatar Modal */}
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header> Change Avatar </Modal.Header>
                        <Modal.Content>
                            <Input  
                                fluid
                                type='file'
                                label='New Avatar'
                                name='previewImage'
                            />
                            <Grid centered stackable columns={2}>
                                <GridRow centered>
                                    {/* smenatic ui class */}
                                    <GridColumn className='ui center aligned grid'>
                                        {/* image preview */}
                                    </GridColumn>
                                    <GridColumn>
                                        {/* cropped image preview  */}
                                    </GridColumn>
                                </GridRow>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='green' inverted>
                                <Icon name='save' /> Change Avatar
                            </Button>
                            <Button color='green' inverted>
                                <Icon name='image' /> Preview
                            </Button>
                            <Button color='red' inverted onClick={this.closeModal}>
                                <Icon name='remove' /> Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </GridColumn>
            </Grid>
        )
    }
}


export default UserPanel;