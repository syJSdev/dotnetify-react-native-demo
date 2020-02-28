import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button, Input } from 'react-native-elements';

import Authentication from '../Authentication';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exception: this.getNavException(props.route.params),
      validationError: '',
      user: '',
      password: '',
    };
  }

  login = () => {
    const {
      navigation: { navigate },
    } = this.props;
    const { user, password } = this.state;
    this.setState({ validationError: null, exception: null });

    Authentication.signIn(user, password)
      .then(() => navigate('Main'))
      .catch(error => {
        if (error.message === '401') {
          this.setState({ validationError: 'Invalid user name or password' });
        } else {
          this.setState({ exception: error.message });
        }
      });
  };

  getNavException = ex => {
    if (!ex) {
      return null;
    }
    return ex.name === 'UnauthorizedAccessException' ||
      ex === 'SecurityTokenExpiredException'
      ? 'Access expired. Please re-login.'
      : ex.message;
  };

  handleChangeInput = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    const { user, password } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <View style={styles.logo} />
          <Text style={styles.text}>dotNetify</Text>
        </View>
        <Card title="dotnetify-react-native-demo">
          <Text style={styles.error_text}>{this.state.exception}</Text>
          <Input
            label="User Name"
            placeholder="Type guest..."
            errorMessage={this.state.exception}
            value={user}
            style={styles.form_element}
            onChangeText={v => this.handleChangeInput('user', v)}
          />
          <Input
            secureTextEntry
            label="Password"
            placeholder="Type dotnetify..."
            value={password}
            style={styles.form_element}
            onChangeText={v => this.handleChangeInput('password', v)}
          />
          <Text style={styles.error_text}>{this.state.validationError}</Text>
          <Button
            buttonStyle={styles.form_element}
            title="Sign In"
            onPress={this.login}
          />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#ddd',
  },
  title: {
    alignItems: 'center',
    marginLeft: 20,
    flexDirection: 'row',
  },
  logo: {
    width: 16,
    height: 16,
    borderRadius: 16,
    backgroundColor: '#92d050',
    marginTop: 22,
    marginRight: 6,
  },
  text: {
    color: '#333',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  error_text: {
    color: '#e33',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginLeft: 20,
  },
  form_element: {
    marginTop: 20,
  },
});
