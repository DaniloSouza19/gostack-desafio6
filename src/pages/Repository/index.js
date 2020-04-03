import React, { Component } from 'react';

import { WebView } from 'react-native-webview';

import PropTypes from 'prop-types';

// import { Container } from './styles';

export default class Repository extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      setOptions: PropTypes.func,
    }).isRequired,
    route: PropTypes.shape({
      params: PropTypes.shape(),
    }).isRequired,
  };

  componentDidMount() {
    const { route, navigation } = this.props;
    const { repository } = route.params;

    navigation.setOptions({ title: repository.name });
  }

  render() {
    const { route } = this.props;
    const { repository } = route.params;

    return <WebView source={{ uri: repository.html_url }} />;
  }
}
