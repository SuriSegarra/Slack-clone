import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setColors } from '../../actions';

import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

class ColorPanel extends Component {
    state = {
        modal: false,
        primary: '',
        secondary: '',
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        userColors: []
    };
    // set up listener to check to see if we have a value for our user prop in state
    componentDidMount() {
        if(this.state.user) {
            this.addListener(this.state.user.uid)
        }
    }

    componentWillUnmount() {
        this.removeListener();
    };

    // removes listener we have set up 
    removeListener = () => {
        this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
    };

    addListener = userId => {
        let userColors = [];
        this.state.usersRef
        // /colors to get all the colors props 
        .child(`${userId}/colors`)
        // in the snap callback we will collect all of the users colors 
        .on("child_added", snap => {
            // put them at the beggining of the arr using the unshift method 
            userColors.unshift(snap.val());
            this.setState({ userColors });

        })
    }

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

    displayUserColors = colors => (
        // greater than 0 to see if we have colors 
        // for each color we are going to display in a fragment 
        colors.length > 0 && colors.map((color, i) => (
            // we're going to pull of the index of the color we're iterating over and set it as the key of the fragment 
            <React.Fragment key={i}>
                <Divider />
                <div 
                    className='color__container' 
                    onClick={() => this.props.setColors(color.primary, color.secondary)}
                >
                    <div className='color__square' style={{background: color.primary}}>
                        <div className='color__overlay' style={{background: color.secondary}}></div>
                    </div>
                </div>
            </React.Fragment>
        ))
    )


    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    render() {
        const { modal, primary, secondary, userColors } = this.state;

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
                {this.displayUserColors(userColors)}
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
};

export default connect(null, {setColors})(ColorPanel)
