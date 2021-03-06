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
    activeIndex: 0,
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

  onScrollEnd = (e) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const viewSize = deviceWidth;

    // Divide the content offset by the size of the view to see which page is visible
    const activeIndex = Math.floor(contentOffset / viewSize) || 0;
    this.setState({ activeIndex });
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

        <AnimatedFlatList
          data={this.state.shots}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }],
            { useNativeDriver: true },
          )}

          removeClippedSubviews={true}

          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}

          onMomentumScrollEnd={this.onScrollEnd}

          renderItem={({ item, index }) => (
            <Card
              lowQuality={index !== this.state.activeIndex}
              item={item}
              index={index}
              animatedScrollValue={this.state.scrollX}
            />
          )}
        />
      </View>
    );
  }
}
