/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NativeModules,
  Image,
  ScrollView
} from 'react-native';
import GalleryManager from 'react-native-gallery-manager';

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      assets: []
    };
    GalleryManager.requestAuthorization().then((result) => {
      GalleryManager.getAssets({ type: 'all', limit: 15, startFrom: 0 }).then((response) => {
        this.setState({ assets: response.assets });
        console.log(response);
        response.assets.forEach(asset => {
          if (asset.type === 'video' && Platform.OS === 'ios') {
            this.convertVideo(asset);
          }
        });
      })
    }).catch((err) => {
      console.log(err);
    });


  };

  convertVideo(asset) {
    GalleryManager.convertVideo({
      id: asset.id,
      compressType: "low",
      convertTo: 'mpeg4'
    }).then((response) => {
      console.log(response);
    }).catch((err) => {
      console.warn(err);
    });
  }

  render() {
    return (
      <ScrollView style={styles.scrollView} removeClippedSubviews={true}>
        {this.state.assets.map((asset, index) => {
          return (<Image style={styles.img} resizeMethod='resize' source={{ uri: asset.uri }} key={asset.id} onLoadEnd={() => console.log(`${asset.uri} loaded`)}/>);
        })}
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  img: {
    height: 200,
    width: 200
  },

});
