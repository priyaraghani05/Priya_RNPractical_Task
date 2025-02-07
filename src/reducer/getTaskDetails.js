import { actionType } from "../constants"


export const getTaskDetails = (state = { data: [] }, action) => {
    switch (action.type) {
        case actionType.ADDTASK:
            return {
                ...state,
                data: [...state.data, action.data],
            };
        case actionType.UPDATETASK:
            return {
                ...state,
                data: state.data.map((task) =>
                    task.id === action.data.id
                        ? action.data
                        : task

                ),
            };

        case actionType.DELETETASK:
            return {
                ...state,
                data: state.data.filter((task) => task.id !== action.data),
            };
        default:
            return state
    }

}