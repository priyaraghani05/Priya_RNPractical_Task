import { actionType } from "../constants";

export const addTask = (value) => {
    console.log("🚀 ~ addTask ~ value:", value)
    return {
        type: actionType.ADDTASK,
        data: value
    }
}