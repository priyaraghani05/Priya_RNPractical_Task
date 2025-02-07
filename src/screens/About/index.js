import { SafeAreaView, Text, View } from "react-native"
import { ResponsiveWidth } from "../../helper"
import { COMMON_STYLE } from "../../constants"
import { LABLE } from "../../constants/lable"




export const About = ({ }) => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
            <Text style={[COMMON_STYLE.textStyle(14, 'black'), { marginHorizontal: ResponsiveWidth(6) }]}>{LABLE['about_app']}</Text>
        </SafeAreaView>
    )
}

