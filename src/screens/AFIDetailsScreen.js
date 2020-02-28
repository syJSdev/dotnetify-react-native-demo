import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import dotnetify from 'dotnetify/react-native';

export default class AFIDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { MovieDetails: { Cast: '' } };

    const {
      navigation: { navigate },
    } = props;
    const { rank } = props.route.params;
    this.vm = dotnetify.react.connect('AFIDetailsVM', this, {
      vmArg: { Rank: rank },
      exceptionHandler: ex => {
        dotnetify.react.getViewModels().forEach(vm => vm.$destroy());
        navigate('Login', ex);
      },
    });
  }

  componentWillUnmount() {
    this.vm.$destroy();
  }

  render() {
    const { MovieDetails } = this.state;

    return (
      <View style={styles.container}>
        <Card title={MovieDetails.Movie}>
          <Text style={styles.header}>Year</Text>
          <Text>{MovieDetails.Year}</Text>
          <Text style={styles.header}>Director</Text>
          <Text>{MovieDetails.Director}</Text>
          <Text style={styles.header}>Cast</Text>
          <Fragment>
            {MovieDetails.Cast.split(',').map((c, idx) => {
              const cast = c.trim();
              return <Text key={idx}>{cast}</Text>;
            })}
          </Fragment>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  header: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});
