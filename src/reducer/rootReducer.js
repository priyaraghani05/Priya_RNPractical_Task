import { combineReducers } from 'redux';


import { getTaskDetails } from './getTaskDetails'


export const rootReducer = combineReducers(
    {
        taskData: getTaskDetails,
    }
);