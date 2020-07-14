import React, { Component } from 'react';
import firebase from '../../firebase';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

export default class ColorPanel extends Component {
    state = {
        modal: false,
        primary: '',
        secondary: '',
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users')
    };

    handleChangePrimary = color => this.setState({ primary: color.hex });

    handleChangeSecondary = color => this.setState({ secondary: color.hex });

    // validation to make sure that we have values for both primary color and secondary color in state
    handleSaveColors = () => {
        if(this.state.primary && this.state.secondary) {
            // if we have values for both, execute fucntion saveColors and pass the values of Primary and Secondary
            this.saveColors(this.state.primary, this.state.secondary);
        }
    };

    // we reach of to firebase using usersRef
    saveColors = (primary, secondary) => {
        this.state.usersRef
            // add child with currentUser id 
            .child(`${this.state.user.uid}/colors`)
            // push uid onto this new prop
            .push()
            // push obj with both the primary and secondary colors that we are getting from the params of save colors 
            .update({
                primary, secondary
            })
            .then(() => {
                console.log('colors added');
                this.closeModal();
            })
            .catch(err => console.error(err));
    };


    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    render() {
        const { modal, primary, secondary } = this.state;

        return (
            <Sidebar
                as={Menu}
                icon='labeled'
                inverted
                vertical
                visible
                width='very thin'
            >
                <Divider/>
                <Button icon='add' size='small' color='blue' onClick={this.openModal}/>

                {/* Color Picker Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Colors</Modal.Header>
                    <Modal.Content>
                        {/* inverted so you can see the text on label */}
                        <Segment inverted >
                            <Label content='Primary Color'/>
                            <SliderPicker color={primary} onChange={this.handleChangePrimary}/>
                        </Segment>

                        <Segment inverted>
                            <Label content='Secondary Color'/>
                            <SliderPicker color={secondary} onChange={this.handleChangeSecondary}/>
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={this.handleSaveColors}>
                            <Icon name='checkmark'/> Save Colors 
                        </Button>
                        <Button color='red' inverted onClick={this.closeModal}>
                            <Icon name='remove'/> Cancel 
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        )
    }
}
