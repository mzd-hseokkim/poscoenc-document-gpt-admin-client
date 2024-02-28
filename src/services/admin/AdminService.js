import api from 'api/Api';

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
  putAdmin,
  deleteAdmin,
  deleteAdmins,
};

export default AdminService;
