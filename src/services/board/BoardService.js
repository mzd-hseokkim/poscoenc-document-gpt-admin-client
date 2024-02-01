import axios from 'axios';
//TODO import api from '../api/Api';

const getBoardList = async () => {
  const response = await axios.get('http://localhost:8080/api/v1/admin/boards');
  return response.data;
};
export default { getBoardList };

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
 *
 */
