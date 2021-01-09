let accessToken = "";
let accessTokenMaster = "";

export const setAccessToken = (s) => {
    return accessToken = s;
  };

  export const setAccessTokenMaster = (s) => {
    return accessTokenMaster = s;
  };


export const getAccessToken = () => {
  return accessToken;
}

export const getAccessTokenMaster = () => {
  return  accessTokenMaster;
}