import { Dimensions, StyleSheet } from 'react-native';

import { ResponsiveFont } from '../helper';
import { COLORS } from './color';




export const COMMON_STYLE = StyleSheet.create({
    textStyle: (size, color = 'black', weight = 'normal', align = 'auto') => {
        return {
            fontSize: ResponsiveFont(size),
            color: COLORS[color],
            fontWeight: weight,
            textAlign: align,
        };
    },



});
