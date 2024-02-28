import api from 'api/Api';

const postUser = async (payload) => {
  const response = await api.post('/admin/user-accounts', payload);
  return response.data;
};
const getUsers = async (params, pageable) => {
  const response = await api.get('/admin/user-accounts', {
    params: {
      name: params.name,
      email: params.email,
      team: params.team,
      memo: params.memo,
      deletionOption: params.deletionOption,
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    },
  });
  return response.data;
};

const getUser = async (id) => {
  const response = await api.get(`/admin/user-accounts/${id}`);
  return response.data;
};

const putUser = async (id, payload) => {
  const response = await api.put(`/admin/user-accounts/${id}`, payload);
  return response.data;
};

const deleteUser = async (id, deleted) => {
  const response = await api.patch(`/admin/user-accounts/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const deleteUsers = async (ids, deleted) => {
  const response = await api.patch(`/admin/user-accounts/deleted/${deleted}`, ids);
  return response.data;
};

const UserService = {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  deleteUsers,
};

export default UserService;
