import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import Spinner from './Spinner';
import registerServiceWorker from './registerServiceWorker';
import firebase from './firebase';
import 'semantic-ui-css/semantic.min.css';

//setting up routing 
import { BrowserRouter as Router, 
    Switch, 
    Route, 
    withRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser, clearUser } from './actions/index';

//global state
const store = createStore(rootReducer, composeWithDevTools()); 

class Root extends React.Component{
    componentDidMount() {
        // console.log(this.props.isLoading)
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                this.props.setUser(user);
                this.props.history.push('/');
            } else {
                this.props.history.push('/login');
                this.props.clearUser();
            }
        });
    }
    render() {
 return this.props.isLoading ? <Spinner/> : (
        <Switch>
            <Route exact path="/"  component={App}/>
            <Route path="/login"  component={Login}/>
            <Route path="/register"  component={Register}/>
        </Switch>
    
        )
    }
}
//we pass the maps state to props func as frost argument to get loading data from our state obj, to see when the set user action still being loaded
const mapStateFromProps = state => ({
    isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser, clearUser })(Root));

//you can only redirect when or whithing a router 
ReactDOM.render(
<Provider store={store}>
<Router>
<RootWithAuth />
</Router>
</Provider>,
 document.getElementById('root'));
registerServiceWorker();
