import axios from "axios";
import { ENDPOINT } from "../global/endPoint";

export const saveLocation = async (
  fixitId: string,
  latitude: any,
  longitude: any
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
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const updateLocation = async (
  fixitId: string,
  latitude: any,
  longitude: any
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
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const getLocation = async (fixitId: string) => {
  const response = await axios.get(`${ENDPOINT}/getFixitLocation/${fixitId}`);
  return response;
};

export const toggleOnStatus = async (
  latitude: any,
  longitude: any,
  fixitId: string
) => {
  const body = JSON.stringify({
    latitude: latitude,
    longitude: longitude,
  });
  const response = await axios.post(`${ENDPOINT}/toggleOn/${fixitId}`, body, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const saveDayOfServiceBilling = async (
  dosID: string,
  work1: string,
  work2: string,
  work3: string,
  paid1: number,
  paid2: number,
  paid3: number,
  total: number
) => {
  const body = JSON.stringify({
    accessories: [
      {
        accessoriesid: generateString(parseInt(paid1.toString().slice(0, 2))),
        accessoriesname: work1,
        accessoriesprice: paid1,
      },
      {
        accessoriesid: generateString(parseInt(paid2.toString().slice(0, 2))),
        cessoriesname: work2,
        accessoriesprice: paid2,
      },
      {
        accessoriesid: generateString(parseInt(paid3.toString().slice(0, 2))),
        cessoriesname: work3,
        accessoriesprice: paid3,
      },
    ],
    servicebillid: generateString(parseInt(total.toString().slice(0, 2))),
    servicecharge: total,
  });

  const response = await axios.post(
    `${ENDPOINT}/saveDayOfServiceBilling/${dosID}`,
    body,
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const toggleOffStatus = async (fixitId: string) => {
  const response = await axios.post(
    `${ENDPOINT}/toggleOff/${fixitId}`,
    {},
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const getFixitStatus = async (fixitId: string) => {
  const response = await axios.get(`${ENDPOINT}/getFixitStatus/${fixitId}`);
  return response;
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateString = (length: number) => {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
