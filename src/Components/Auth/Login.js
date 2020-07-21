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

class Login extends React.Component {

    state= {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)


    handleChange= (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.isFormValid(this.state)) {
            this.setState({ errros: [], loading: true });
            firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser);
            })
        .catch(err => {
            console.error(err);
            this.setState({
                errors: this.state.errors.concat(err),
                loading: false
            });
        });
    }
};

isFormValid = ({ email, password }) => email && password;

handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
}


    render() {
        const { 
            email, 
            password, 
            errors,
            loading
        } = this.state;

        return (
           <Grid textAlign='center' verticalAlign='middle' className='app'>
               <GridColumn style={{ maxWidth: 450 }}>
                   <Header 
                    as='h1' 
                    icon
                     color='violet' 
                     textAlign='center'
                    >
                   <Icon name='code branch' color='violet'/>
                   Login to DevChat
                   </Header>
                   <Form onSubmit={this.handleSubmit} size='large'>
                       <Segment stacked>
                           <Form.Input 
                             fluid 
                             name='email' 
                             icon='mail' 
                             iconPosition='left' 
                             placeholder='Email Address' 
                             onChange={this.handleChange} 
                             value={email}
                             className={this.handleInputError(errors, 'email')}
                             type='email'
                            />

                           <Form.Input
                             fluid name='password' 
                             icon='lock' iconPosition='left' 
                             placeholder='Password' 
                             onChange={this.handleChange}
                             value={password}
                             className={this.handleInputError(errors, 'password')}
                             type='password'
                            />

                           <Button disabled={loading} className={loading ? 'loading' : ''} color='violet' fluid size='large'>
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
                    <Message>Don't have an account? <Link to='/register'> Register</Link></Message>
               </GridColumn>
           </Grid>
        )
    }
}

export default Login;

