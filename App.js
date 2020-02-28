import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import {
  Alert,
  Platform,
  Text,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dotnetify from 'dotnetify/react-native';
import signalRnetfx from 'dotnetify/dist/signalR-netfx';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigation from './src/AppNavigation';
import Authentication from './src/Authentication';

const androidEmulatorServerUrl = 'http://<your_local_ip>:5000';
const liveServerUrl = 'http://dotnetify.net';
const serverUrl =
  Platform.OS === 'android' ? androidEmulatorServerUrl : liveServerUrl;

dotnetify.debug = true;

// Live server is still running an older signalR version, which requires a different SignalR client library.
if (serverUrl === liveServerUrl) {
  dotnetify.hubLib = signalRnetfx;
  dotnetify.hubServerUrl = serverUrl + '/signalr';
  dotnetify.hubOptions.pingInterval = 60000;
} else {
  dotnetify.hubServerUrl = serverUrl;
  dotnetify.hubOptions.pingInterval = 6000;
}

Authentication.url = serverUrl + '/token';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
      connectionStatus: null,
    };

    dotnetify.connectionStateHandler = (state, ex) => {
      this.setState({ connectionStatus: state === 'connected' ? null : state });
      if (state === 'error') {
        Alert.alert('Connection Error', ex.message, [{ text: 'OK' }], {
          cancelable: false,
        });
      }
    };
  }

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  handleLoadingError = error => {
    this.setState({ isLoadingComplete: false });
    console.warn(error);
  };

  render() {
    const { skipLoadingScreen } = this.props;
    const { connectionStatus, isLoadingComplete } = this.state;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return (
      <NavigationContainer>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}
          {connectionStatus !== null ? (
            <Text style={styles.error}>{connectionStatus}</Text>
          ) : (
            <AppNavigation />
          )}
        </View>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  error: {
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
  },
});

async function loadResourcesAsync() {
  await Promise.all([Font.loadAsync(Ionicons.font)]);
}

export default App;
