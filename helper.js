import { Dimensions, PixelRatio } from 'react-native';

export const { width, height } = Dimensions.get("window")


// based on iPhone6 scale
// const scale = width / 375;
// Reference screen dimensions (base on average Android screen dimensions)
const baseWidth = 375; // base width for scaling, iPhone X size

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
