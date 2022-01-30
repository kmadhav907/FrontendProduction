import axios from 'axios';

export const getOTPForAuthorization = async (phoneNumber: string) => {
  const response: any = await axios.get(
    `https://askwebapp.herokuapp.com/getInOTP/${phoneNumber}/sp`,
  );
  return response;
};
export const verifyOTPForAuthorization = async (
  phoneNumber: string,
  otpToVerify: string,
) => {
  const params = JSON.stringify({
    number: phoneNumber,
    otp: otpToVerify,
    usertype: 'sp',
  });
  const response = await axios.post(
    'https://askwebapp.herokuapp.com/verifOtp',
    params,
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );
  return response;
};
export const resendOTP = async (phoneNumber: string) => {
  const response: any = await axios.get(
    `https://askwebapp.herokuapp.com/resendOtp/${phoneNumber}/sp`,
  );
  return response;
};
