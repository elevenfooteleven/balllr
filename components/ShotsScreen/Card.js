import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import moment from 'moment';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const icons = {
  views: require('./views.png'),
  comments: require('./comments.png'),
  likes: require('./likes.png'),
};

export default class Card extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.lowQuality !== nextProps.lowQuality || 
      this.props.item.id !== nextProps.item.id;
  }

  render() {
    const { item, index, animatedScrollValue, lowQuality } = this.props;

    return (
      <Animated.View
        style={{
          marginHorizontal: 8,
          height: deviceHeight - 20,
          borderRadius: 24,
          transform: [
            { perspective: 800 },
            {
              scale: animatedScrollValue.interpolate({
                inputRange: [
                  (index - 1) * deviceWidth,
                  index * deviceWidth,
                  (index + 1) * deviceWidth,
                ],
                outputRange: [0.5, 1, 0.5],
                extrapolate: 'clamp',
              }),
            },
            {
              rotateX: animatedScrollValue.interpolate({
                inputRange: [
                  (index - 1) * deviceWidth,
                  index * deviceWidth,
                  (index + 1) * deviceWidth,
                ],
                outputRange: ['45deg', '0deg', '45deg'],
                extrapolate: 'clamp',
              }),
            },
            {
              rotateY: animatedScrollValue.interpolate({
                inputRange: [
                  (index - 1) * deviceWidth,
                  index * deviceWidth,
                  (index + 1) * deviceWidth,
                ],
                outputRange: ['-45deg', '0deg', '45deg'],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <Animated.ScrollView
          style={{
            backgroundColor: 'white',
            borderRadius: 24,
            paddingTop: 8,
          }}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Animated.View
            style={{
              width: deviceWidth - 16,
              transform: [
                {
                  scale: animatedScrollValue.interpolate({
                    inputRange: [
                      (index - 1) * deviceWidth,
                      index * deviceWidth,
                      (index + 1) * deviceWidth,
                    ],
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}
          >
            <Animated.View
              shouldRasterizeIOS
              renderToHardwareTextureAndroid
              style={{
                width: deviceWidth - 16,
              }}
            >
              <Animated.View
                shouldRasterizeIOS={true}
                style={{
                  width: deviceWidth - 16,
                  padding: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  transform: [
                    {
                      scale: animatedScrollValue.interpolate({
                        inputRange: [
                          (index - 1) * deviceWidth,
                          index * deviceWidth,
                          (index + 1) * deviceWidth,
                        ],
                        outputRange: [0, 1, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                  opacity: animatedScrollValue.interpolate({
                    inputRange: [
                      (index - 1) * deviceWidth + 240,
                      index * deviceWidth,
                      (index + 1) * deviceWidth - 240,
                    ],
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                  }),
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    marginRight: 12,
                    borderRadius: 28,
                    shadowColor: 'black',
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                  }}
                >
                  <Image
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                    }}
                    source={{ uri: item.user.avatar_url }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '700',
                      letterSpacing: 0.1,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {item.title}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        fontSize: 13,
                        letterSpacing: -0.078,
                        color: '#8F8E94',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {'by '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        letterSpacing: -0.078,
                        color: '#ea4c89',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Text>
                        {item.user.name}
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        letterSpacing: -0.078,
                        color: '#8F8E94',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {` on ${moment(item.created_at).format('MMM D, YYYY')}`}
                    </Text>
                  </View>
                </View>
              </Animated.View>
              <View
                style={{
                  width: deviceWidth - 16,
                  height: 600 / 800 * deviceWidth - 16,
                  backgroundColor: '#4A4A52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator color="white" animating size="large" />
                <Animated.Image
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    transform: [
                      {
                        translateX: animatedScrollValue.interpolate({
                          inputRange: [
                            (index - 1) * deviceWidth,
                            index * deviceWidth,
                            (index + 1) * deviceWidth,
                          ],
                          outputRange: [-80, 0, 80],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  }}
                  source={{
                    uri: item.images.teaser,
                  }}
                />
                {!lowQuality && <Animated.Image
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    transform: [
                      {
                        translateX: animatedScrollValue.interpolate({
                          inputRange: [
                            (index - 1) * deviceWidth,
                            index * deviceWidth,
                            (index + 1) * deviceWidth,
                          ],
                          outputRange: [-80, 0, 80],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  }}
                  source={{
                    uri: item.images.hdpi ? item.images.hdpi : item.images.normal,
                  }}
                />}
              </View>
              <View style={styles.hairlineBorder} />
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={{
                      width: 24,
                      resizeMode: 'contain',
                      marginRight: 4,
                      tintColor: '#8F8E94',
                    }}
                    source={icons.views}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      letterSpacing: -0.078,
                      color: '#8F8E94',
                    }}
                  >
                    {item.views_count}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    style={{
                      width: 24,
                      resizeMode: 'contain',
                      marginRight: 4,
                      tintColor: '#8F8E94',
                    }}
                    source={icons.comments}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      letterSpacing: -0.078,
                      color: '#8F8E94',
                    }}
                  >
                    {item.comments_count}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Image
                    style={{
                      width: 24,
                      resizeMode: 'contain',
                      marginRight: 4,
                      tintColor: '#8F8E94',
                    }}
                    source={icons.likes}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      letterSpacing: -0.078,
                      color: '#8F8E94',
                    }}
                  >
                    {item.likes_count}
                  </Text>
                </View>
              </View>
              <View style={styles.hairlineBorder} />
              {item.description &&
                <View
                  style={{
                    marginVertical: 16,
                    paddingHorizontal: 16,
                  }}
                >
                  <View>
                    <HTMLView
                      stylesheet={styles}
                      value={item.description.replace(/\n\n/g, '')}
                    />
                  </View>
                </View>}
              {!item.description &&
                <View
                  style={{
                    marginVertical: 24,
                    marginHorizontal: 16,
                  }}
                >
                  <Text style={styles.p}>No description ¯\_(ツ)_/¯</Text>
                </View>}
            </Animated.View>
          </Animated.View>
        </Animated.ScrollView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  p: {
    fontSize: 18,
    letterSpacing: -0.3,
    lineHeight: 24,
    color: '#515154',
  },
  a: {
    color: '#ea4c89',
  },
  hairlineBorder: {
    width: deviceWidth - 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
  },
});
