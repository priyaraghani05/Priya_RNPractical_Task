import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { COMMON_STYLE, COLORS, actionType } from "../../constants"
import { ResponsiveHeight, ResponsiveWidth } from "../../helper"

import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask, updateTask } from "../../action";

import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/MaterialIcons';



export const Home = ({ }) => {
    const dispatch = useDispatch();
    const swipeableRef = useRef(null);

    const taskData = useSelector(state => state.taskData)


    const [isVisible, setVisible] = useState(false)
    const [isLoaded, setLoader] = useState(false)
    const [todoData, setTodoData] = useState([])
    const [selectedItem, setSelectedItem] = useState({})
    const [isEdit, setEdit] = useState(false)
    const [input, setInput] = useState({ value: "", isError: false, errorText: "" })

    useEffect(() => {
        setTodoData(taskData?.data)
    }, [taskData])


    function addTaskDetails() {
        const state_obj = { ...input }
        if (input.value?.trim() == '') {
            state_obj.isError = true
            state_obj.errorText = "task name should not be empty"
            console.log("state_obj >>> ", state_obj);
            setInput(state_obj)
        } else {
            const payload = {
                title: input.value,
                isCompleted: false,
                id: Date.now().toString(),

            }
            dispatch(addTask(payload))
            setVisible(false)
            setInput({ value: "", isError: false, errorText: "" })
        }
    }


    function maketaskComplete(item) {
        const payload = {
            ...item,
            isCompleted: !item?.isCompleted,

        }
        dispatch(updateTask(payload))
    }

    function updateTodoTitle() {
        const payload = {
            ...selectedItem,
            title: input.value,

        }
        dispatch(updateTask(payload))
        setVisible(false)
        setInput({ value: "", isError: false, errorText: "" })
        setEdit(false)
        swipeableRef.current.close();

    }

    function deleteTodoItem(id) {
        dispatch(deleteTask(id))
        swipeableRef.current.close();
    }

    function onClickItem(item) {
        setVisible(true)
        setEdit(true)
        setSelectedItem(item)
        setInput(preValue => ({ ...preValue, value: item?.title?.toString() }));
    }

    function handleAddEditTask() {
        isEdit ? updateTodoTitle() : addTaskDetails()

    };

    function onCloseModal() {
        setVisible(false)
        setInput({ value: "", isError: false, errorText: "" })
        setEdit(false)
        setSelectedItem({})
    }

    function onChangeText(text) {
        const state_obj = { ...input }
        state_obj.value = text
        state_obj.errorText = ''
        state_obj.isError = false
        setInput(state_obj)
    }

    const renderRightActions = (item) => (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => deleteTodoItem(item.id)} style={styles.deleteContainer}>
                <Icon name={'delete'} size={ResponsiveWidth(6)} color={COLORS['dark_red']} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onClickItem(item)} style={styles.editContainer}>
                <Icon name={'edit'} size={ResponsiveWidth(6)} color={COLORS['black']} />
            </TouchableOpacity>
        </View>
    );


    const _renderItems = ({ item, index }) => (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={() => renderRightActions(item)}>
            <View style={styles.cardView}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={COMMON_STYLE.textStyle(14, 'black', 'bold')} >{"Task Title: "}</Text>
                    <Text style={COMMON_STYLE.textStyle(14, 'black')} >{item?.title}</Text>
                </View>
                <TouchableOpacity style={styles.checkboxStyle} onPress={() => maketaskComplete(item)}>
                    {item?.isCompleted && <Icon name={'check'} size={ResponsiveWidth(4)} color={COLORS['green']} />}
                </TouchableOpacity>
            </View>
        </Swipeable>
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <FlatList
                data={todoData}
                renderItem={_renderItems}
                keyExtractor={(item) => `task_${item.id}`}
                style={{ marginBottom: ResponsiveHeight(8) }}

            />

            <TouchableOpacity style={styles.floatBtnStyle} onPress={() => setVisible(true)}>
                <Icon name={'add'} size={ResponsiveWidth(6)} color={COLORS['white']} />
            </TouchableOpacity>


            <Modal
                visible={isVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={onCloseModal}
            >
                <TouchableWithoutFeedback onPress={onCloseModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={COMMON_STYLE.textStyle(16)}>Task Name:</Text>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Enter task"
                                    value={input.value}
                                    onChangeText={onChangeText}
                                />
                                <Text style={COMMON_STYLE.textStyle(16, 'dark_red')}>{input.errorText}</Text>
                                <TouchableOpacity style={styles.btnStyle} onPress={handleAddEditTask}>
                                    <Text style={COMMON_STYLE.textStyle(16, 'white')}>Add Task</Text>
                                </TouchableOpacity>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {isLoaded && <ActivityIndicator size="large" color={COLORS.orange} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
            }


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: ResponsiveWidth(2),
        padding: ResponsiveWidth(4),
        width: '90%',
        maxHeight: '80%',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: ResponsiveWidth(2),
        paddingHorizontal: ResponsiveWidth(3),
        paddingVertical: ResponsiveHeight(3),
        marginVertical: ResponsiveHeight(1),
    },
    btnStyle: {
        marginHorizontal: ResponsiveWidth(6),
        paddingVertical: ResponsiveHeight(1.5),
        backgroundColor: COLORS['blue'],
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: ResponsiveWidth(2),
        marginVertical: ResponsiveHeight(1.5)
    },
    floatBtnStyle: {
        width: ResponsiveWidth(12),
        height: ResponsiveWidth(12),
        right: ResponsiveWidth(3),
        backgroundColor: COLORS['blue'],
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: ResponsiveWidth(12),
        bottom: ResponsiveHeight(1.5),
        position: 'absolute'
    },
    checkboxStyle: {
        width: ResponsiveWidth(6),
        height: ResponsiveWidth(6),
        borderWidth: 1.5,
        borderRadius: ResponsiveWidth(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardView: {
        backgroundColor: '#fff',
        elevation: 5, // Adds shadow on Android
        shadowOffset: { width: 0, height: 2 }, // Shadow at the bottom
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginVertical: 8,
        overflow: 'hidden',
        paddingVertical: ResponsiveHeight(1.5),
        flexDirection: 'row',
        paddingHorizontal: ResponsiveWidth(4)
    },
    editContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ResponsiveWidth(1),
        marginRight: ResponsiveWidth(2),
    },
    deleteContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ResponsiveWidth(3),
        marginRight: ResponsiveWidth(1),
    }
})