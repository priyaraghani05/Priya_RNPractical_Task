import { actionType } from "../constants";

export const deleteTask = (value) => {
    return {
        type: actionType.DELETETASK,
        data: value
    }
}