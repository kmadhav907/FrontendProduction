import axios from 'axios';
import {ENDPOINT} from '../global/endPoint';

export const saveLocation = async (
  fixitId: string,
  latitude: any,
  longitude: any,
) => {
  const data = JSON.stringify({
    fixitId: fixitId,
    latitude: latitude,
    longitude: longitude,
  });
  const response = await axios.post(
    `${ENDPOINT}/fixitSaveLocation/${fixitId}`,
    data,
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};

export const updateLocation = async (
  fixitId: string,
  latitude: any,
  longitude: any,
) => {
  const params = JSON.stringify({
    fixitId: fixitId,
    latitude: latitude,
    longitude: longitude,
  });
  const response = await axios.post(
    `${ENDPOINT}/updateLocation/${fixitId}`,
    params,
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};

export const getLocation = async (fixitId: string) => {
  const response = await axios.get(`${ENDPOINT}/getLocation/${fixitId}`);
  return response;
};
