import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import HTMLView from 'react-native-htmlview';
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default ({ comment }) =>
  <View
    style={{
      flex: 1,
      marginHorizontal: 16,
    }}
  >
    <View style={{ marginVertical: 16 }}>
      <View
        style={{
          width: 40,
          height: 40,
          marginBottom: 8,
          marginRight: 8,
          borderRadius: 20,
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
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
          source={{ uri: comment.user.avatar_url }}
        />
      </View>
      <HTMLView
        stylesheet={commentStyles}
        value={comment.body.replace(/\n/g, '')}
      />
    </View>
    <View style={commentStyles.hairlineBorder} />
  </View>;

const commentStyles = StyleSheet.create({
  p: {
    // flex: 3,
    // flexWrap: 'wrap',
    // flexShrink: 1,
    fontSize: 15,
    letterSpacing: -0.24,
    lineHeight: 18,
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
