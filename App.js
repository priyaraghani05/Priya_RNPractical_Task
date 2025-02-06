import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    useDerivedValue,
    useAnimatedReaction,
    runOnJS
} from 'react-native-reanimated';
import Video from 'react-native-video';

import { ResponsiveFont, ResponsiveHeight, ResponsiveWidth } from './helper';
import { IMAGES } from './src/assets';


function App() {

    const videoRef = useRef(null);
    const background = require('./background.mp4');
    const [isPlaying, setIsPlaying] = useState(false);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const isPlayingState = useSharedValue(isPlaying);



    const containerWidth = ResponsiveWidth(85);
    const containerHeight = ResponsiveHeight(22);
    const dotSize = ResponsiveWidth(10);


    const translateX = useSharedValue((containerWidth - dotSize) / 2);
    const translateY = useSharedValue((containerHeight - dotSize) / 2);

    const [xScore, setXScore] = useState(0);
    const [yScore, setYScore] = useState(0);



    const derivedXScore = useDerivedValue(() => {
        return Math.round(
            (Math.abs(translateX.value - (containerWidth - dotSize) / 2) / ((containerWidth - dotSize) / 2)) * 100
        );
    });

    const derivedYScore = useDerivedValue(() => {
        return Math.round(
            (Math.abs(translateY.value - (containerHeight - dotSize) / 2) / ((containerHeight - dotSize) / 2)) * 100
        );
    });

    useAnimatedReaction(
        () => {
            return { x: derivedXScore.value, y: derivedYScore.value };
        },
        (scores) => {
            runOnJS(setXScore)(scores.x);
            runOnJS(setYScore)(scores.y);
        }
    );



    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            if (!isPlayingState.value) return;
            ctx.startX = translateX.value;
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            if (!isPlayingState.value) return;
            translateX.value = ctx.startX + event.translationX;
            translateY.value = ctx.startY + event.translationY;
        },
        onEnd: () => {
            if (!isPlayingState.value) return;
            translateX.value = withSpring(Math.max(0, Math.min(translateX.value, containerWidth - dotSize)));
            translateY.value = withSpring(Math.max(0, Math.min(translateY.value, containerHeight - dotSize)));
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    useEffect(() => {
        isPlayingState.value = isPlaying;
    }, [isPlaying]);



    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);

    };


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const restartVideo = () => {
        if (videoRef.current) {
            videoRef.current.seek(0);
            setIsPlaying(false);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }} >


                <View style={{ width: '100%', flex: 1, borderRadius: ResponsiveWidth(2) }}>
                    <Video
                        source={background}
                        paused={!isPlaying}
                        ref={videoRef}
                        onBuffer={() => { }}
                        onError={(e) => console.log("🚀 ~ VideoTutorial ~ e:", e)}
                        onEnd={() => restartVideo()}
                        style={styles.videoViewStyle}
                        resizeMode='contain'
                        onLoad={(data) => setDuration(data.duration)}
                        onProgress={(data) => setCurrentTime(data.currentTime)}
                    />
                    <Text style={[styles.scoreText, { marginHorizontal: ResponsiveWidth(8) }]}>{formatTime(currentTime)} / {formatTime(duration)}</Text>

                    <TouchableOpacity onPress={togglePlayPause} style={styles.buttonContainer} >
                        <Image source={IMAGES[isPlaying ? 'pause' : 'stop']} style={{ width: ResponsiveWidth(4), height: ResponsiveWidth(4) }} resizeMode='contain' tintColor={'white'} />
                    </TouchableOpacity>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>X: {xScore}</Text>
                        <Text style={styles.scoreText}>Y: {yScore}</Text>
                    </View>



                    <View style={[styles.rectangle, { width: containerWidth, height: containerHeight }]}>
                        <PanGestureHandler onGestureEvent={onGestureEvent}>
                            <Animated.View style={[styles.dot, animatedStyle]} />
                        </PanGestureHandler>
                        <TouchableOpacity style={[styles.top]}>
                            <Image source={IMAGES['happy']} style={{ width: ResponsiveWidth(12), height: ResponsiveWidth(12) }} resizeMode='contain' />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.bottom]}>
                            <Image source={IMAGES['unhappy']} style={{ width: ResponsiveWidth(12), height: ResponsiveWidth(12) }} resizeMode='contain' />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.left]}>
                            <Image source={IMAGES['dislike']} style={{ width: ResponsiveWidth(12), height: ResponsiveWidth(12) }} resizeMode='contain' />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.right]}>
                            <Image source={IMAGES['like']} style={{ width: ResponsiveWidth(12), height: ResponsiveWidth(12) }} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>



                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <TouchableOpacity
                        disabled={isPlaying}
                        style={[styles.roundContainer, { opacity: isPlaying ? 0.5 : 1 }]} onPress={() => setIsPlaying(true)}>
                        <Image source={IMAGES['stop']} style={{ width: ResponsiveWidth(5), height: ResponsiveWidth(5) }} resizeMode='contain' tintColor={"#2C7873"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={!isPlaying}
                        onPress={() => setIsPlaying(false)}
                        style={[styles.pauseBotton, { opacity: isPlaying ? 1 : 0.5 }]}>
                        <Image source={IMAGES['pause']} style={{ width: ResponsiveWidth(6), height: ResponsiveWidth(6) }} resizeMode='contain' tintColor={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={currentTime == 0}
                        style={[styles.roundContainer, { opacity: currentTime == 0 ? 0.5 : 1 }]} onPress={() => restartVideo()}>
                        <Image source={IMAGES['play']} style={{ width: ResponsiveWidth(5), height: ResponsiveWidth(5) }} resizeMode='contain' tintColor={"#2C7873"} />
                    </TouchableOpacity>

                </View>

            </SafeAreaView>

        </GestureHandlerRootView>
    );
}



const styles = StyleSheet.create({

    centerDot: {
        width: ResponsiveWidth(10),
        height: ResponsiveWidth(10),
        borderRadius: ResponsiveWidth(10),
        backgroundColor: '#2C7873',
    },
    top: {
        position: 'absolute',
        top: -25,
        alignSelf: 'center',
    },
    bottom: {
        position: 'absolute',
        bottom: -25,
        alignSelf: 'center',
    },
    left: {
        position: 'absolute',
        left: -25,
        top: '50%',
        marginTop: -25,
    },
    right: {
        position: 'absolute',
        right: -25,
        top: '50%',
        marginTop: -25,
    },

    rectangle: {
        width: ResponsiveWidth(85),
        height: ResponsiveHeight(22),
        backgroundColor: '#74A9A7',
        alignSelf: 'center',
        marginVertical: ResponsiveHeight(5)

    },
    dot: {
        width: ResponsiveWidth(10),
        height: ResponsiveWidth(10),
        borderRadius: ResponsiveWidth(10),
        backgroundColor: '#2C7873',
        position: 'absolute',
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: ResponsiveWidth(25),
        marginHorizontal: ResponsiveWidth(8)
    },
    scoreText: {
        fontSize: ResponsiveFont(16),
        fontWeight: 'bold',
    },
    roundContainer: {
        width: ResponsiveWidth(10),
        height: ResponsiveWidth(10),
        borderWidth: 2,
        borderRadius: ResponsiveWidth(10),
        borderColor: "#2C7873",
        marginVertical: ResponsiveHeight(2),
        marginHorizontal: ResponsiveWidth(8),
        alignItems: 'center',
        justifyContent: 'center'
    },
    pauseBotton: {
        width: ResponsiveWidth(16),
        height: ResponsiveWidth(16),
        borderRadius: ResponsiveWidth(16),
        backgroundColor: "#2C7873",
        marginVertical: ResponsiveHeight(2),
        marginHorizontal: ResponsiveWidth(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: ResponsiveHeight(18),
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 50,
    },
    videoViewStyle: {
        marginTop: ResponsiveHeight(10),
        height: ResponsiveHeight(22),
        borderRadius: ResponsiveWidth(2)
    }

});


export default App;
