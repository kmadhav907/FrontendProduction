import axios from 'axios';
import {ENDPOINT} from '../global/endPoint';

export const uploadProfilePic = async (imageData: any, fixitId: string) => {
  const params = imageData;
  const response = await axios.post(
    `${ENDPOINT}/uploadfixitImage/${fixitId}`,
    params,
    {
      headers: {
        accept: '*/*',
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
};
