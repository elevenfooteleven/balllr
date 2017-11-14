const apiEndpoint = 'https://api.dribbble.com/v1/shots';
const { accessToken } = require('../secret');

export const fetchShotsAndComments = () =>
  fetch(`${apiEndpoint}?page=1&timeframe=month&per_page=50&access_token=${accessToken}`)
    .then(response => response.json())
    .then(shots =>
      Promise.all(shots.map(shot =>
        fetch(`${shot.comments_url}?access_token=${accessToken}`)
          .then(response => response.json())
          .then(comments => ({
            ...shot,
            comments,
          }))
        ))
    )
    .catch(error => {
      console.log(error);
      Alert.alert(
        'Meh Heh!',
        'Looks like we hit Dribbble’s API rate limit. Load this app again in 1000ms.',
      );
    });
