import axios from 'axios';
import {ENDPOINT} from '../global/endPoint';

export const getNotification = async (
  fixitID: String,
  latitude: number,
  longitude: Number,
) => {
  const location = {
    latitude: latitude,
    longitude: longitude,
  };
  const params = JSON.stringify({
    fixitID,
    location,
  });
  const response = await axios.post(
    `${ENDPOINT}/getRequest/${fixitID}/${location}`,
    params,
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );
  return response;
};

export const selectNotification = async (
  notificationID: Number,
  fixitID: String,
  confirmation: Boolean,
) => {
  const response = await axios.post(
    `${ENDPOINT}/selectRequest/${notificationID}/${fixitID}`,
    JSON.stringify({confirmation}),
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};
