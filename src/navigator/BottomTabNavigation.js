import { View } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as screens from '../screens'
import { ResponsiveHeight, ResponsiveWidth } from '../helper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { LABLE } from '../constants/lable';


const Tab = createBottomTabNavigator();


function MyTabBar({ state, descriptors, navigation }) {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    return (
        <View style={{ flexDirection: 'row' }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <PlatformPressable
                        key={route.key}
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1 }}
                    >
                        <View style={{ height: ResponsiveHeight(5), alignItems: 'center', justifyContent: 'center', marginBottom: ResponsiveHeight(1) }}>
                            <Icon name={LABLE[label]} size={ResponsiveWidth(6)} color={isFocused ? colors.primary : colors.text} />
                            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
                                {label}
                            </Text>

                        </View>
                    </PlatformPressable>
                );
            })}
        </View>
    );
}


export function MyTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }} tabBar={(props) => <MyTabBar {...props} />}>
            <Tab.Screen name="Home" component={screens.Home} />
            <Tab.Screen name="About" component={screens.About} />
        </Tab.Navigator>
    );
}