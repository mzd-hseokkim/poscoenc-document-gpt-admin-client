import api from '../../api/Api';

const getBoardList = async () => {
  const response = await api.get('/admin/boards');
  return response.data.content;
};

export { getBoardList };

/* for search query
     params: {
      id: params.id,
      author: params.createdBy,
      isAdmin: params.isAdmin,
      title: params.title,
      content: params.content,
      registered: params.createdAt,
      //REMIND status or deleted
      deleted: params.status,
    }
 */
