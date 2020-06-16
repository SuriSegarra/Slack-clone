import React from 'react';
import firebase from '../../firebase';
import { Grid, 
    Form, 
    Segment,
    Button,
    Header, 
    Message, 
    Icon, 
    GridColumn } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
//stateful component
class Register extends React.Component {

    state= {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: []
    }

    isFormValid = () => {
        let errors = [];
        let error;

        //make sure all our inputs are filled out 
        if(this.isFormEmpty(this.state)){
            //throw error
            error = { message: 'Fill all fields' };
            this.setState({ errors: errors.concat(error) })
            return false; //do not execute handle submit 

        } else if(!this.isPasswordValid(this.state)) {
            //throw error
            error = { message: 'Password is invalid' }
            this.setState({ errors: errors.concat(error)})
            return false;

        } else {
            //form valid. allow data to be sent to firebase 
            return true;
        }
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if(password.length <6 || passwordConfirmation.length < 6 ) { 
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)


    handleChange= (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        //makes sure that all of the fiels are filled out
        if(this.isFormValid()) {
        e.preventDefault();
        firebase 
        //make use of auth tools
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
            console.log(createdUser);
        })
        .catch(err => {
            console.log(err);
        })
    }
}

    render() {
        const { username, email, password, passwordConfirmation, errors } = this.state;
        return (
           <Grid textAlign='center' verticalAlign='middle' className='app'>
               <GridColumn style={{ maxWidth: 450 }}>
                   <Header 
                    as='h2' 
                    icon
                     color='orange' 
                     textAlign='center'
                    >
                   <Icon name='puzzle piece' color='orange'/>
                   Register for DevChat
                   </Header>
                   <Form onSubmit={this.handleSubmit} size='large'>
                       <Segment stacked>
                           <Form.Input fluid
                             name='username'
                             icon='user' 
                             iconPosition='left' 
                             placeholder='username' 
                             onChange={this.handleChange} 
                             value={username}
                             type='text'
                            />

                           <Form.Input 
                             fluid 
                             name='email' 
                             icon='mail' 
                             iconPosition='left' 
                             placeholder='Email Address' 
                             onChange={this.handleChange} 
                             value={email}
                             type='email'
                            />

                           <Form.Input
                             fluid name='password' 
                             icon='lock' iconPosition='left' 
                             placeholder='Password' 
                             onChange={this.handleChange}
                             value={password}
                             type='password'
                            />

                           <Form.Input 
                             fluid 
                             name='passwordConfirmation' 
                             icon='repeat' iconPosition='left' 
                             placeholder='Password Confirmation' 
                             onChange={this.handleChange} 
                             value={passwordConfirmation}
                             type='password'
                            />

                           <Button 
                             color='orange' 
                             fluid 
                             size='large'
                            >
                             Submit
                            </Button>
                       </Segment>
                   </Form>
                   {/* //display any errors */}
                   
                   {errors.length > 0 && (
                    //if is > 0, show user message
                       <Message error>
                           <h3>Error</h3>
                           {/* passing errors array from state */}
                           {this.displayErrors(errors)}
                       </Message>
                   )}
                    <Message>Already a user?<Link to='/login'> Login</Link></Message>
               </GridColumn>
           </Grid>
        )
    }
}

export default Register;

