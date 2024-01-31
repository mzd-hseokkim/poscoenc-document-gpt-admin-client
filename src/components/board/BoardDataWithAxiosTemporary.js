import { useEffect, useState } from 'react';
import axios from 'axios';

const BoardDataWithAxiosTemporary = () => {

  const axiosInstance = axios.create({
    baseURL: 'https://your-api-endpoint.com',
    // Additional common settings like headers
  });

  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    axios
      .get('https://')
      .then((response) => {
        setBoardData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
};

return (

)
