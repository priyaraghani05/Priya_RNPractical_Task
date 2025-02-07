import { actionType } from "../constants";

export const updateTask = (value) => {
    return {
        type: actionType.UPDATETASK,
        data: value
    }
}