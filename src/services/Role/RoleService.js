import api from '../../api/Api';

const getRoles = async () => {
  const response = await api.get('/admin/roles');
  return response.data;
};

const getRole = async (id) => {
  const response = await api.get(`/admin/roles/${id}`);
  return response.data;
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
  postRole,
  putRole,
  deleteRole,
  deleteRoles,
};

export default RoleService;
