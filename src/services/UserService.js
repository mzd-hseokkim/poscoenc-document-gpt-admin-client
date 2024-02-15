import api from '../api/Api';

const postUser = async (payload) => {
  const response = await api.post('/admin/user-accounts', payload);
  return response.data;
};
const getUserList = async (params) => {
  const response = await api.get('/admin/user-accounts', {
    params: {
      name: params.name,
      email: params.email,
      team: params.team,
      memo: params.memo,
      deletionOption: params.deletionOption,
      page: params.page,
      size: params.size,
    },
  });
  return response.data;
};

const getUserDetail = async (id) => {
  const response = await api.get(`/admin/user-accounts/${id}`);
  return response.data;
};

const putUserDetail = async (id, payload) => {
  const response = await api.put(`/admin/user-accounts/${id}`, payload);
  return response.data;
};

const patchDeleteSingleUser = async (id, deleted) => {
  const response = await api.patch(`/admin/user-accounts/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const patchDeleteMultipleUser = async (ids, deleted) => {
  const response = await api.patch(`/admin/user-accounts/deleted/${deleted}`, ids);
  return response.data;
};

const UserService = {
  getUserList,
  getUserDetail,
  postUser,
  putUserDetail,
  patchDeleteSingleUser,
  patchDeleteMultipleUser,
};

export default UserService;
