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
    page: 1,
  };

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const { stars } = this.state;
    const { route, navigation } = this.props;
    const { user } = route.params;

    this.setState({ loading: true });

    navigation.setOptions({ title: user.name });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      loading: false,
      page,
    });
  };

  loadMore = async () => {
    const { page, stars } = this.state;

    if (stars.length >= 30) {
      const nextPage = page + 1;

      this.load(nextPage);
    }
  };

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
            onEndReachedThereshold={0.2}
            onEndReached={this.loadMore}
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
