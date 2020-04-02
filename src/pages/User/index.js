import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static propTypes = {
    route: PropTypes.shape({
      params: PropTypes.shape(),
    }).isRequired,
    navigation: PropTypes.shape({
      setOptions: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
  };

  async componentDidMount() {
    const { route, navigation } = this.props;
    const { user } = route.params;

    this.setState({ loading: true });

    navigation.setOptions({ title: user.name });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  render() {
    const { stars, loading } = this.state;
    const { route } = this.props;

    const { user } = route.params;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio} </Bio>
        </Header>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Stars
            data={stars}
            keyExtractor={(star) => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name} </Title>
                  <Author>{item.owner.login} </Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
