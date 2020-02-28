import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import dotnetify from 'dotnetify/react-native';

import Authentication from '../Authentication';

export default class AFITop100Screen extends React.Component {
  static navigationOptions = {
    title: 'AFI Top 100',
  };

  constructor(props) {
    super(props);
    this.state = { Movies: [] };

    const {
      navigation: { navigate },
    } = props;
    Authentication.getAccessToken().then(
      token =>
        (this.vm = dotnetify.react.connect('AFITop100ListVM', this, {
          vmArg: { RecordsPerPage: 20 },
          setState: this.updateMovies,
          headers: { Authorization: 'Bearer ' + token },
          exceptionHandler: ex => {
            dotnetify.react.getViewModels().forEach(vm => vm.$destroy());
            navigate('Login', ex);
          },
        }))
    );
  }

  componentWillUnmount() {
    this.vm.$destroy();
  }

  updateMovies = newState => {
    const { Movies } = newState;
    newState.Movies = this.state.Movies.concat(Movies);
    this.setState(newState);
  };

  getMoreMovies = () => {
    if (this.state.CurrentPage < this.state.MaxPage) {
      this.vm.$dispatch({ Next: null });
    }
  };

  render() {
    const {
      navigation: { navigate },
    } = this.props;

    if (!this.state.Movies.length) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.Movies}
          onEndReachedThreshold={0.5}
          onEndReached={this.getMoreMovies}
          keyExtractor={item => `${item.Rank} - ${item.Movie}`}
          renderItem={({ item }) => {
            const navArg = { rank: item.Rank, title: `AFI #${item.Rank}` };
            return (
              <ListItem
                title={
                  <View style={styles.listItem}>
                    <Text style={styles.circle}>{item.Rank}</Text>
                    <Text>{item.Movie}</Text>
                  </View>
                }
                containerStyle={styles.list_container}
                onPress={() => navigate('AFIDetails', navArg)}
              />
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list_container: {
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    color: 'white',
    backgroundColor: '#00BCD4',
    textAlign: 'center',
    paddingTop: 2,
    marginRight: 10,
    marginTop: -1,
  },
});
