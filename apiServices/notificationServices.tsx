/* eslint-disable prettier/prettier */
import axios from 'axios';
import {ENDPOINT} from '../global/endPoint';

export const getNotification = async (
  fixitID: String,
  latitude: number | undefined,
  longitude: number | undefined,
) => {
  const location = {
    latitude: latitude,
    longitude: longitude,
  };
  const params = JSON.stringify({
    // fixitID,
    location,
  });
  const response = await axios.post(
    `${ENDPOINT}/getRequest/${fixitID}/{location}`,
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
  notificationID: String,
  fixitID: String,
  confirmation: String  ,
)  => {
 const url = `${ENDPOINT}/selectRequest/${notificationID}/${fixitID}?confirmation=${confirmation}`;
 console.log(url);
  const response = await axios.get(url,
    {
      headers: {
        accept: '*/*',
      },
    },
  );
  return response;
};

export const MyServices = async (fixitID: String, notificationID: String) => {
  console.log(notificationID);
  // const response = axios.get(`${ENDPOINT}/Myservices/${fixitID}`, {
  //   headers: {
  //     accept: '*/*',
  //   },
  // });
  // return response;
};
