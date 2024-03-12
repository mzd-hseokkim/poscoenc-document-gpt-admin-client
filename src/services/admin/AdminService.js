import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const postAdmin = async (payload) => {
  const response = await api.post(`/admin/admin-users`, payload);
  return response.data;
};

const getAdmins = async (params, pageable) => {
  const response = await api.get('/admin/admin-users', {
    params: {
      email: params.email,
      name: params.name,
      role: params.role,
      fromLoggedInAt: params.fromLoggedInAt,
      toLoggedInAt: params.toLoggedInAt,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      fromModifiedAt: params.fromModifiedAt,
      toModifiedAt: params.toModifiedAt,
      findEmptyLogin: params.findEmptyLogin,
      deletionOption: params.deletionOption,
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    },
  });
  return response.data;
};

const getAdmin = async (id) => {
  const response = await api.get(`/admin/admin-users/${id}`);
  return response.data;
};
const getDownloadAdminList = async (params) => {
  const response = await api.get('/admin/admin-users/excel', {
    params: {
      email: params.email,
      name: params.name,
      role: params.role,
      fromLoggedInAt: params.fromLoggedInAt,
      toLoggedInAt: params.toLoggedInAt,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      fromModifiedAt: params.fromModifiedAt,
      toModifiedAt: params.toModifiedAt,
      findEmptyLogin: params.findEmptyLogin,
      deletionOption: params.deletionOption,
    },
    responseType: 'blob',
  });

  let fileName = `admin-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
const putAdmin = async (id, payload) => {
  const response = await api.put(`/admin/admin-users/${id}`, payload);
  return response.data;
};

const deleteAdmin = async (id, deleted) => {
  const response = await api.patch(`/admin/admin-users/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const deleteAdmins = async (ids, deleted) => {
  const response = await api.patch(`/admin/admin-users/deleted/${deleted}`, ids);
  return response.data;
};

const AdminService = {
  postAdmin,
  getAdmin,
  getAdmins,
  getDownloadAdminList,
  putAdmin,
  deleteAdmin,
  deleteAdmins,
};

export default AdminService;
