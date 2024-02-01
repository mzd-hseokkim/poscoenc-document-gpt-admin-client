import axios from 'axios';

export const getBoardList = async (params) => {
  const response = await axios.get('http:localhost:8080/api/v1/admin/board', {
    params: {
      id: params.id,
      author: params.createdBy,
      isAdmin: params.isAdmin,
      title: params.title,
      content: params.content,
      registered: params.createdAt,
      //REMIND status or deleted
      deleted: params.status,
    },
  });
  return response.data;
};
