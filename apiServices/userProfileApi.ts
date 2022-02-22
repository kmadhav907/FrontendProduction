import axios from 'axios';
import {ENDPOINT} from '../global/endPoint';

export const uploadProfilePic = async (imageData: any, fixitId: string) => {
  const params = {imageFile: imageData};
  const response = await axios.post(
    `${ENDPOINT}/uploadfixitImage/${fixitId}`,
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
};
