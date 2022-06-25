/* eslint-disable prettier/prettier */
import axios from "axios";
import { ENDPOINT } from "../global/endPoint";

export const getNotification = async (
  fixitID: String,
  latitude: number | undefined,
  longitude: number | undefined
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
        "content-type": "application/json",
      },
    }
  );
  return response;
};

export const selectNotification = async (
  notificationID: String,
  fixitID: String,
  confirmation: String
) => {
  const response = await axios.get(
    `${ENDPOINT}/selectRequest/${notificationID}/${fixitID}?confirmation=${confirmation}`,
    {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const MyServices = async (fixitID: String, notificationID: String) => {
  console.log(notificationID);
  const response = axios.get(`${ENDPOINT}/Myservices/${fixitID}`, {
    headers: {
      accept: "*/*",
    },
  });
  return response;
};
export const getCurrentService = async (fixitId: String) => {
  const response = axios.get(`${ENDPOINT}/currentServices/${fixitId}`, {
    headers: {
      accept: "*/*",
    },
  });
  return response;
};
export const getHistroy = async (fixitId: string) => {
  const response = axios.get(`${ENDPOINT}/historyServices/${fixitId}`, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  return response;
};
export const getETATimings = (dosId: string) => {
  const response = axios.get(`${ENDPOINT}/getEstimatedHour/${dosId}`, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const getCustomerFeedBack = (dosId: string) => {
  const response = axios.get(`${ENDPOINT}/feedbackReview/${dosId}`, {
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
  });
  return response;
};
export const setReachedStatus = (dosId: string, status: string) => {
  const response = axios.get(
    `${ENDPOINT}/fixitreachstatus/${dosId}?status=${status}`
  );
  return response;
};
