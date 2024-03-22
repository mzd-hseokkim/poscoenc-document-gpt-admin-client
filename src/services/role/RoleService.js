import api from 'api/Api';
import { formatToYMD, getCurrentDate } from 'utils/common/dateUtils';

const getRoles = async () => {
  const response = await api.get('/admin/roles');
  return response.data;
};

const getRole = async (id) => {
  const response = await api.get(`/admin/roles/${id}`);
  return response.data;
};

const getDownloadRoleList = async () => {
  const response = await api.get('/admin/roles/excel', {
    responseType: 'blob',
  });
  let fileName = `role-list_${formatToYMD(getCurrentDate())}.xlsx`;
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

const postRole = async (roleName) => {
  const response = await api.post('/admin/roles', roleName, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  return response.data;
};

const putRole = async (id, roleName) => {
  const response = await api.put(`/admin/roles/${id}`, roleName, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  return response.data;
};

const deleteRole = async (id, deleted) => {
  const response = await api.patch(`/admin/roles/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const deleteRoles = async (ids, deleted) => {
  const response = await api.patch(`/admin/roles/deleted/${deleted}`, ids);
  return response.data;
};

const RoleService = {
  getRoles,
  getRole,
  getDownloadRoleList,
  postRole,
  putRole,
  deleteRole,
  deleteRoles,
};

export default RoleService;
