import axios from "axios";

export const getUser = () => {
  return axios.get(
    "https://quick-leopard-17.clerk.accounts.dev/v1/dev_browser"
  );
};
