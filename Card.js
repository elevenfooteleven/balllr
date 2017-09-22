import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  ScrollView
} from "react-native";

import HTMLView from "react-native-htmlview";
import moment from "moment";

const { width: deviceWidth } = Dimensions.get("window");
let COUNTER = 0;

export default class Card extends React.Component {
  constructor() {
    super();

    this.state = {
      progress: new Animated.Value(0),
      animationHasPlayed: false
    };
  }

  playAnimation = () => {
    if (!this.state.animationHasPlayed) {
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 2000
      }).start();
    } else {
      this.state.progress.setValue(0);
    }

    this.setState({ animationHasPlayed: !this.state.animationHasPlayed });
  };

  render() {
    const {
      item,
      index,
      scrollX,
      cardTopAnimatedVal,
      cardTitleOpacityAnimatedVal,
      finishedAnimating
    } = this.props;

    return (
      <ScrollView
        style={{ overflow: "visible" }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Animated.View
          style={{
            opacity: cardTitleOpacityAnimatedVal,
            height: 64,
            marginTop: 20 + 24,
            marginBottom: 24,
            marginLeft: 24,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              marginRight: 12,
              borderRadius: 28,
              shadowColor: "black",
              shadowOpacity: 0.1,
              shadowRadius: 1,
              shadowOffset: {
                width: 0,
                height: 1
              }
            }}
          >
            <Image
              style={{
                width: 56,
                height: 56,
                borderRadius: 28
              }}
              source={{ uri: item.user.avatar_url }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 34 / 2,
                fontWeight: "700",
                letterSpacing: 0.1,
                backgroundColor: "transparent"
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 15,
                letterSpacing: -0.24,
                color: "#8F8E94",
                backgroundColor: "transparent"
              }}
            >
              {`${item.user.name} on ${moment(item.created_at).format(
                "MMM D, YYYY"
              )}`}
            </Text>
          </View>
        </Animated.View>
        <Animated.View
          style={{
            width: deviceWidth,
            transform: [{ translateY: cardTopAnimatedVal }]
          }}
        >
          <Animated.View
            shouldRasterizeIOS
            renderToHardwareTextureAndroid
            style={{
              marginHorizontal: 8,
              width: deviceWidth - 16,
              backgroundColor: "white",
              borderRadius: 24,
              shadowColor: "black",
              shadowOpacity: 0.1,
              shadowRadius: 2,
              shadowOffset: {
                width: 0,
                height: 1
              }
            }}
          >
            <View
              style={{
                width: deviceWidth - 16,
                height: 600 / 800 * (deviceWidth - 16),
                backgroundColor: "#4A4A52",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: "hidden"
              }}
            >
              <Image
                onLoad={() => {
                  COUNTER += 1;
                  if (COUNTER === 5) {
                    this.props.runFunction();
                  }
                }}
                style={{ ...StyleSheet.absoluteFillObject }}
                source={{ uri: item.images.hidpi }}
              />
            </View>
            <View
              style={{
                width: deviceWidth - 16,
                height: StyleSheet.hairlineWidth,
                backgroundColor: "#ccc"
              }}
            />
            <View style={{ marginVertical: 24, marginHorizontal: 16 }}>
              <View>
                <HTMLView
                  stylesheet={styles}
                  value={item.description.replace(/\n\n/g, "\n")}
                />
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  p: {
    fontSize: 18,
    letterSpacing: -0.3,
    lineHeight: 24,
    color: "#515154"
  },
  a: {
    color: "#ea4c89"
  }
});
