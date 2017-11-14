import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  FlatList,
  Alert,
} from 'react-native';

import secret from '../secret';
import Card from './Card';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class App extends React.Component {
  state = {
    shots: [],
    shotsComments: [],
    dataLoaded: false,
    animating: false,
  };

  _scrollX = new Animated.Value(0);

  componentDidMount() {
    const apiEndpoint = 'https://api.dribbble.com/v1/shots';
    const accessToken = secret.accessToken;

    fetch(
      `${apiEndpoint}?page=1&timeframe=month&per_page=50&access_token=${accessToken}`,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ shots: responseJson }, () => {
          this.setState({ dataLoaded: true });
          // responseJson.map(shot => Image.prefetch(shot.images.hidpi));
          // responseJson.map(shot =>
          //   fetch(
          //     `${apiEndpoint}/${shot.id}/comments?access_token=${accessToken}`
          //   )
          //     .then(commentsResponse => commentsResponse.json())
          //     .then(commentsResponse =>
          //       this.setState({ shotsComments: commentsResponse })
          //     )
          //     .catch(error => console.log(error))
          // );
        });
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          'Meh Heh!',
          'Looks like we hit Dribbble’s API rate limit. Load this app again in 1000ms.',
        );
      });

    Animated.loop(
      Animated.timing(this.dribbbleBallAnimatedVal, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ).start();
  }

  // Dribbble loading animation
  dribbbleBallAnimatedVal = new Animated.Value(0);

  loadingView = () => (
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
              scaleX: this.dribbbleBallAnimatedVal.interpolate({
                inputRange: [0, 0.5, 0.75, 1],
                outputRange: [1, 1.1, 1, 1],
              }),
            },
            {
              scaleY: this.dribbbleBallAnimatedVal.interpolate({
                inputRange: [0, 0.5, 0.75, 1],
                outputRange: [1, 1, 1.1, 1],
              }),
            },
            {
              translateY: this.dribbbleBallAnimatedVal.interpolate({
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
          opacity: this.dribbbleBallAnimatedVal.interpolate({
            inputRange: [0, 0.25, 1],
            outputRange: [0.15, 0.3, 0.15],
          }),
          transform: [
            {
              scaleX: this.dribbbleBallAnimatedVal.interpolate({
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

  render() {
    if (!this.state.dataLoaded) {
      return this.loadingView();
    }

    return (
      <View style={{ paddingTop: 20, backgroundColor: '#ea4c89' }}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />

        <AnimatedFlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          // style={{ overflow: 'hidden' }}
          // removeClippedSubviews={true}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this._scrollX } } }],
            { useNativeDriver: true },
          )}
          data={this.state.shots}
          keyExtractor={item => item.id}
          windowSize={3}
          onMomentumScrollBegin={() => this.setState({ animating: true })}
          onMomentumScrollEnd={() => this.setState({ animating: false })}
          renderItem={({ item, index }) => (
            <Card
              defer={this.state.animating}
              item={item}
              index={index}
              animatedScrollValue={this._scrollX}
            />
          )}
        />
      </View>
    );
  }
}
