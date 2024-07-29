import axios from 'axios';

const API_URL = 'http://localhost:8080/messages';

const sendMessage = (token, receiverUsername, content) => {
  console.log('sendMessage function called with:', { token, receiverUsername, content });
  return axios.post(
    `${API_URL}/send`,
    { receiverUsername, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

const getMessages = (token) => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json'
    },
  });
};

const markAsRead = (token, messageId) => {
  return axios.put(
    `${API_URL}/${messageId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export { sendMessage, getMessages, markAsRead };
