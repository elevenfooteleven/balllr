import React from 'react';
import { View, Animated, Image, Text, StyleSheet } from 'react-native';

export default class Card extends React.Component {

  state = {
    dribbbleBallAnimatedVal: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.dribbbleBallAnimatedVal, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ).start();
  }

  render() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'transparent',
        }}
      >
        <Animated.View
          shouldRasterizeIOS
          style={{
            marginBottom: 20,
            transform: [
              {
                scaleX: this.state.dribbbleBallAnimatedVal.interpolate({
                  inputRange: [0, 0.5, 0.75, 1],
                  outputRange: [1, 1.1, 1, 1],
                }),
              },
              {
                scaleY: this.state.dribbbleBallAnimatedVal.interpolate({
                  inputRange: [0, 0.5, 0.75, 1],
                  outputRange: [1, 1, 1.1, 1],
                }),
              },
              {
                translateY: this.state.dribbbleBallAnimatedVal.interpolate({
                  inputRange: [0, 0.25, 0.3, 1],
                  outputRange: [0, 20, 20, 0],
                }),
              },
            ],
          }}
        >
          <Image source={require('./dribbble-ball.png')} />
        </Animated.View>
        <Animated.View
          style={{
            marginBottom: 8,
            opacity: this.state.dribbbleBallAnimatedVal.interpolate({
              inputRange: [0, 0.25, 1],
              outputRange: [0.15, 0.3, 0.15],
            }),
            transform: [
              {
                scaleX: this.state.dribbbleBallAnimatedVal.interpolate({
                  inputRange: [0, 0.25, 1],
                  outputRange: [4, 6, 4],
                }),
              },
            ],
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'black',
          }}
        />
        <Text style={{ color: '#EB4C89' }}>Loading shots!</Text>
      </View>
    );
  }
}