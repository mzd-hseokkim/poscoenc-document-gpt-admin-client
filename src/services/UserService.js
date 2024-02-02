import api from '../api/Api';

const createUser = async (payload) => {
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
      fromLastPullRequest: params.fromLastPullRequest,
      toLastPullRequest: params.toLastPullRequest,
      findEmptyPullRequest: params.findEmptyPullRequest,
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

const updateUser = async (id, payload) => {
  const response = await api.put(`/admin/user-accounts/${id}`, payload);
  return response.data;
};

const deleteSingleUser = async (id, deleted) => {
  const response = await api.patch(`/admin/user-accounts/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const deleteMultipleUser = async (ids, deleted) => {
  const response = await api.patch(`/admin/user-accounts/deleted/${deleted}`, ids);
  return response.data;
};

export default {
  getUserList,
  getUserDetail,
  createUser,
  updateUser,
  deleteSingleUser,
  deleteMultipleUser,
};
