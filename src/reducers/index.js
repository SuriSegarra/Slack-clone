//allows to determine what property on GS a given reducer updates  
import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

//how user will look like w/o any changes
const initialUserState = {
    currentUser: null, 
    isLoading: true
};

const user_reducer = (state = initialUserState, action) => {
    //updates state accordingly dependending upon type of the action thats coming in 
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                //update state wjere we take the current user data thats coming from:
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case actionTypes.CLEAR_USER:
            return {
                ...initialUserState,
                isLoading: false
            }
            //if it doesnt match the given action, its going to return state as it was 
            default: 
            return state;
    }
}

//want reducer functions to only operare on a certain part of state.

//ej: user reducer should only modify our user property on the GS

//within the obs that it takes we can determine that user reducer will be updating and put it state values on this user property 

const rootReducer = combineReducers({
    user: user_reducer
});

export default rootReducer;
