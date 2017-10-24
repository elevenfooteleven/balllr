import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  FlatList,
  Alert
} from "react-native";

import Card from "./Card";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class App extends React.Component {
  state = {
    shots: [],
    shotsComments: []
  };

  componentDidMount() {
    const apiEndpoint = "https://api.dribbble.com/v1/shots";
    const accessToken =
      "34ae2608185d1faab2f5af942cc6da77170fae669272146bd82fe0fb6a012788";

    fetch(`${apiEndpoint}?page=1&per_page=30&access_token=${accessToken}`)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ shots: responseJson }, () => {
          this.dataLoaded = true;
          this.animateMiniCards();
          responseJson.map(shot => Image.prefetch(shot.images.hidpi));
          responseJson.map(shot =>
            fetch(
              `${apiEndpoint}/${shot.id}/comments?access_token=${accessToken}`
            )
              .then(commentsResponse => commentsResponse.json())
              .then(commentsResponse =>
                this.setState({ shotsComments: commentsResponse })
              )
              .catch(error => console.log(error))
          );
        });
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          "Meh Heh!",
          "Looks like we hit Dribbble’s API rate limit. Load this app again in 1000ms."
        );
      });

    Animated.loop(
      Animated.timing(this.dribbbleBallAnimatedVal, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ).start();
  }

  scrollX = new Animated.Value(0);
  miniCardsScaleVal = new Animated.Value(0.25);
  fakeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  cardTopVal = this.fakeArray.map(() => new Animated.Value(deviceHeight * 2.4));
  cardOpacityVal = new Animated.Value(0);
  cardsFinishedAnimating = false;
  // Dribbble loading animation
  dribbbleBallAnimatedVal = new Animated.Value(0);
  dataLoaded = false;

  loadingView = () => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent"
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
                outputRange: [1, 1.1, 1, 1]
              })
            },
            {
              scaleY: this.dribbbleBallAnimatedVal.interpolate({
                inputRange: [0, 0.5, 0.75, 1],
                outputRange: [1, 1, 1.1, 1]
              })
            },
            {
              translateY: this.dribbbleBallAnimatedVal.interpolate({
                inputRange: [0, 0.25, 0.3, 1],
                outputRange: [0, 20, 20, 0]
              })
            }
          ]
        }}
      >
        <Image source={require("./dribbble-ball.png")} />
      </Animated.View>
      <Animated.View
        style={{
          marginBottom: 8,
          opacity: this.dribbbleBallAnimatedVal.interpolate({
            inputRange: [0, 0.25, 1],
            outputRange: [0.15, 0.3, 0.15]
          }),
          transform: [
            {
              scaleX: this.dribbbleBallAnimatedVal.interpolate({
                inputRange: [0, 0.25, 1],
                outputRange: [4, 6, 4]
              })
            }
          ],
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: "black"
        }}
      />
      <Text style={{ color: "#EB4C89" }}>Loading shots!</Text>
    </View>
  );

  animateMiniCards = () => {
    setTimeout(() => {
      Animated.stagger(
        50,
        this.fakeArray.map((wat, i) =>
          Animated.spring(this.cardTopVal[i], {
            toValue: deviceHeight * 1.8,
            tension: 75,
            friction: 9,
            useNativeDriver: true
          })
        )
      ).start(this.animateCardsToFinalPosition);
    }, 1000);
  };

  animateCardsToFinalPosition = () => {
    this.cardsFinishedAnimating = true;

    const animationsToRunInParallel = this.fakeArray.map((wat, i) =>
      Animated.spring(this.cardTopVal[i], {
        toValue: 0,
        tension: 75,
        friction: 12,
        useNativeDriver: true
      })
    );

    animationsToRunInParallel.push(
      Animated.timing(this.miniCardsScaleVal, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(this.cardOpacityVal, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    );
    Animated.parallel(animationsToRunInParallel).start();
  };

  render() {
    return (
      <View>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "#f4f4f4"
          }}
        />
        <Animated.View
          style={{
            width: deviceWidth,
            height: deviceHeight,
            transform: [{ scale: this.miniCardsScaleVal }]
          }}
        >
          <AnimatedFlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ overflow: "visible" }}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.scrollX } } }],
              {
                useNativeDriver: true
              }
            )}
            removeClippedSubviews={true}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            data={this.state.shots}
            keyExtractor={item => item.id}
            windowSize={3}
            renderItem={({ item, index }) => (
              <Card
                item={item}
                index={index}
                scrollX={this.scrollX}
                cardTopAnimatedVal={this.cardTopVal[index]}
                cardTitleOpacityAnimatedVal={this.cardOpacityVal}
                finishedAnimating={this.cardsFinishedAnimating}
              />
            )}
          />
        </Animated.View>
        {!this.dataLoaded && this.loadingView()}
      </View>
    );
  }
}
