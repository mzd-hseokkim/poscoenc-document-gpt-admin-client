import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const postUser = async (payload) => {
  const response = await api.post('/admin/user-accounts', payload);
  return response?.data;
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
  return response?.data;
};

const getDownloadSearchedUserList = async (params) => {
  const response = await api.get('/admin/user-accounts/excel', {
    params: {
      name: params.name,
      email: params.email,
      team: params.team,
      memo: params.memo,
      deletionOption: params.deletionOption,
    },
    responseType: 'blob',
  });
  let fileName = `user-account-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

const getUser = async (id) => {
  if (!id) {
    return;
  }
  const response = await api.get(`/admin/user-accounts/${id}`);
  return response?.data;
};

const putUser = async (id, payload) => {
  const response = await api.put(`/admin/user-accounts/${id}`, payload);
  return response?.data;
};

const deleteUsers = async (ids, deleted) => {
  const response = await api.patch(`/admin/user-accounts/deleted/${deleted}`, ids);
  return response?.data;
};

const UserService = {
  getUsers,
  getUser,
  getDownloadSearchedUserList,
  postUser,
  putUser,
  deleteUsers,
};

export default UserService;
