import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AnimatedGaugeProgress } from 'react-native-simple-gauge';
import dotnetify from 'dotnetify/react-native';

const gaugeSize = 250;
const gaugeWidth = 20;
const cropDegree = 45;
const textOffset = gaugeWidth;
const textWidth = gaugeSize - textOffset * 2;
const textHeight = gaugeSize * (1 - cropDegree / 360) - textOffset * 2;

export default class LiveGaugeScreen extends React.Component {
  static navigationOptions = {
    title: 'Live Gauge',
  };

  constructor(props) {
    super(props);
    this.state = { Value: null };

    const {
      navigation: { navigate },
    } = props;
    this.vm = dotnetify.react.connect('LiveGaugeVM', this, {
      exceptionHandler: ex => {
        dotnetify.react.getViewModels().forEach(vm => vm.$destroy());
        navigate('Login', ex);
      },
    });
  }

  componentWillUnmount() {
    this.vm && this.vm.$destroy();
  }

  render() {
    if (!this.state.Value) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <AnimatedGaugeProgress
          fill={this.state.Value}
          size={gaugeSize}
          width={gaugeWidth}
          cropDegree={cropDegree}
          tintColor="#9acfea"
          backgroundColor="#d9edf5"
          strokeCap="circle">
          {fill => (
            <View style={styles.digitalView}>
              <Text style={styles.digital}>{this.state.Value}</Text>
            </View>
          )}
        </AnimatedGaugeProgress>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitalView: {
    top: textOffset,
    left: textOffset,
    width: textWidth,
    height: textHeight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digital: {
    fontSize: 80,
  },
});
