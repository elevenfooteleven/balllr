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
import { fetchShotsAndComments } from '../../api/Dribbble';

import Loading from '../Loading';
import Card from './Card';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class App extends React.Component {
  state = {
    shots: [],
    loading: true,
    animating: false,
    scrollX: new Animated.Value(0),
  };

  componentDidMount() {
    fetchShotsAndComments()
    .then(responseJson => {
      this.setState({ 
        shots: responseJson,
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <View style={{ paddingTop: 20, backgroundColor: '#ea4c89' }}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        />

        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }],
            { useNativeDriver: true },
          )}
        >
          {this.state.shots.map((item, index) => (
            <Card
              key={item.id}
              isAnimating={this.state.animating}
              item={item}
              index={index}
              animatedScrollValue={this.state.scrollX}
            />
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

