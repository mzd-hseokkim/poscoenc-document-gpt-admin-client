import api from '../../api/Api';

const getRoleList = async () => {
  const response = await api.get('/admin/roles');
  return response.data;
};

const getSingleRole = async (id) => {
  const response = await api.get(`/admin/roles/${id}`);
  return response.data;
};

const createRole = async (roleName) => {
  const response = await api.post('/admin/roles', roleName, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  return response.data;
};

const updateRole = async ({ id, roleName }) => {
  const response = await api.put(`/admin/roles/${id}`, roleName, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  return response.data;
};

const deleteSingleRole = async (id, deleted) => {
  const response = await api.patch(`/admin/roles/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const deleteMultipleRole = async (ids, deleted) => {
  const response = await api.patch(`/admin/roles/deleted/${deleted}`, ids);
  return response.data;
};

export default {
  getRoleList,
  getSingleRole,
  createRole,
  updateRole,
  deleteSingleRole,
  deleteMultipleRole,
};
