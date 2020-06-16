import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon, GridColumn } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
//stateful component
class Register extends React.Component {

    state= {}

    handleChange= () => {}
    render() {
        return (
           <Grid textAlign='center' verticalAlign='middle' className='app'>
               <GridColumn style={{ maxWidth: 450 }}>
                   <Header as='h2' icon color='orange' textAlign='center'>
                   <Icon name='puzzle piece' color='orange'/>
                   Register for DevChat
                   </Header>
                   <Form size='large'>
                       <Segment stacked>
                           <Form.Input fluid name='username' icon='user' iconPosition='left' 
                           placeholder='username' onChange={this.handleChange} type='text'/>

                           <Form.Input fluid name='email' icon='mail' iconPosition='left' 
                           placeholder='Email Address' onChange={this.handleChange} type='email'/>

                           <Form.Input fluid name='password' icon='lock' iconPosition='left' 
                           placeholder='Password' onChange={this.handleChange} type='password'/>

                           <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left' 
                           placeholder='Password Confirmation' onChange={this.handleChange} type='password'/>

                           <button color='orange' fluid size='large'>Submit</button>
                       </Segment>
                   </Form>
                    <Message>Already a user?<Link to='/login'> Login</Link></Message>
               </GridColumn>
           </Grid>
        )
    }
}

export default Register;

