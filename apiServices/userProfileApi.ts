import axios from "axios";
import { ENDPOINT } from "../global/endPoint";

export const uploadProfilePic = async (imageData: any, fixitId: string) => {
  const response = await axios.post(
    `${ENDPOINT}/uploadfixitImage/${fixitId}`,
    imageData,
    {
      headers: {
        accept: "*/*",
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};
export const editProfile = async (
  email: string,
  experience: string,
  userName: string,
  fixitId: string,
  workShopAddress: string,
  specialCategory: any[]
) => {
  const data = JSON.stringify({
    email: email,
    experience: experience,
    fixitName: userName,
    fixitid: fixitId,
    workshopadress: workShopAddress,
  });
  const response = await axios.post(
    `${ENDPOINT}/editProfile/${fixitId}/?spcl=${specialCategory}`,
    data,
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return response;
};

export const getUserDetails = async (fixitId: string) => {
  const response = await axios.get(`${ENDPOINT}/getprofiledetails/${fixitId}`);
  return response;
};
