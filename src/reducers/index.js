//allows to determine what property on GS a given reducer updates  
import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

//how user will look like w/o any changes
const initialUserState = {
    currentUser: null, 
    isLoading: true,
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
                ...state,
                isLoading: false
            }
            //if it doesnt match the given action, its going to return state as it was 
            default: 
            return state;
    }
}

const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false,
    userPosts: null
};

const channel_reducer = (state = initialChannelState, action) => {
    switch (action.type){
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.payload.isPrivateChannel
            }
        case actionTypes.SET_USER_POSTS:
            return {
                ...state,
                userPosts: action.payload.userPosts
            }
        default:
            return state;
    }
};

const initialColorState = {
    primaryColor: '#4c3c4c',
    secondaryColor:'eee'
}

const colors_reducer = (state = initialColorState, action) => {
    //will swtich based on the action type
    switch (action.type) {
        case actionTypes.SET_COLORS:
            return {
                primaryColor: action.payload.primaryColor,
                secondaryColor: action.payload.secondaryColor
            }
        default: 
        return state;
    }
}

//want reducer functions to only operare on a certain part of state.

//ej: user reducer should only modify our user property on the GS

//within the obs that it takes we can determine that user reducer will be updating and put it state values on this user property 

const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer,
    colors: colors_reducer
});


export default rootReducer;
