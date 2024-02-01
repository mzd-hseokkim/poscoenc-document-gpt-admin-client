import api from '../../api/Api';

const getBoardList = async () => {
  const response = await api.get('/admin/boards');
  return response.data.content;
};

export { getBoardList };
