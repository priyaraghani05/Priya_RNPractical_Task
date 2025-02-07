import { Dimensions, PixelRatio } from 'react-native';

export const { width, height } = Dimensions.get("window")


const baseWidth = 375;

const scale = width / baseWidth;


export const ResponsiveWidth = (w) => {
    return PixelRatio.roundToNearestPixel(width * (w / 100))
}

export const ResponsiveHeight = (h) => {
    return PixelRatio.roundToNearestPixel(height * (h / 100))
}


export const ResponsiveFont = (size) => {
    return Math.round(PixelRatio.roundToNearestPixel(scale * size))

}
