import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Loading,
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
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const { route, navigation } = this.props;
    const { user } = route.params;

    navigation.setOptions({ title: user.name });
    this.load();
  }

  load = async (page = 1) => {
    const { stars } = this.state;
    const { route } = this.props;
    const { user } = route.params;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      loading: false,
      refreshing: false,
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

  refreshList = async () => {
    this.setState({ refreshing: true, stars: [] }, this.load);
  };

  handleNavigate = (repository) => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { stars, loading, refreshing } = this.state;
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
          <Loading />
        ) : (
          <Stars
            data={stars}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThereshold={0.2}
            onEndReached={this.loadMore}
            keyExtractor={(star) => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
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
