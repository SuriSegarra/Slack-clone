import React from 'react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';

import { Grid, GridColumn, GridRow, Header, HeaderContent, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: '',
        croppedImage: '',
        blob: ''
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

    handleChange = e => {
        // refenrece the first file in the files arr 
        const file = e.target.files[0];
        // file reader API.  reads the contents of files (or raw data buffers) stored on the user's computer
        const reader = new FileReader();

        if(file) {
            // reads the file within 
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result })
            } )
        }
    };

    // to crop prev image
    handleCropImage = () => {
        // check that we have this reference
        if(this.AvatarEditor) {
            // this will do the cropping in our image
            this.AvatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({ 
                    croppedImage: imageUrl,
                    // sends the images file over to firebase storage
                    blob 
                });
            });
        }
    }

    handleSignOut = () => {
        firebase
        .auth()
        .signOut()
        .then(() => console.log('signed out'));

    } 
    render() {

        const { user, modal, previewImage, croppedImage } = this.state;
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
                                onChange={this.handleChange}
                                fluid
                                type='file'
                                label='New Avatar'
                                name='previewImage'
                            />
                            <Grid centered stackable columns={2}>
                                <GridRow centered>
                                    {/* smenatic ui class */}
                                    <GridColumn className='ui center aligned grid'>
                                        {/* if we have a prev image we're going to show the avatar editor component where it accepts an image  */}
                                        {previewImage && (
                                            <AvatarEditor 
                                                ref={node => (this.AvatarEditor = node)}
                                                image={previewImage}
                                                // px
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </GridColumn>
                                    <GridColumn>
                                        {/* first check if we have a value for a cropped Image in state, if so, renders  image component   */}
                                        {croppedImage && (
                                            <Image
                                                style={{ margin: '3.5em auto' }}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        )}
                                    </GridColumn>
                                </GridRow>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {/* only show this button if we have a cropped Image */}
                            {croppedImage && <Button color='green' inverted>
                                <Icon name='save' /> Change Avatar
                            </Button>}
                            <Button color='green' inverted onClick={this.handleCropImage}>
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