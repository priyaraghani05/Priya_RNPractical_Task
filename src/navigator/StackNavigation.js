import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import * as screens from '../screens'
import { MyTabs } from './BottomTabNavigation';

const Stack = createStackNavigator();

export function StackNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
                <Stack.Screen name="Home" component={MyTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}