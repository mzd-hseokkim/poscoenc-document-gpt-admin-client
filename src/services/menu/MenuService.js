import api from '../../api/Api';

const getMenuList = async (params) => {
  const response = await api.get('/admin/menus', {
    params: {
      name: params.name,
      urlPath: params.urlPath,
      menuOrder: params.menuOrder,
      parentId: params.parentId,
      fromCreatedAt: params.fromCreatedAt,
      toCreatedAt: params.toCreatedAt,
      fromModifiedAt: params.fromModifiedAt,
      toModifiedAt: params.toModifiedAt,
      deletionOption: params.deletionOption,
    },
  });
  return response.data;
};

const getAuthorizedMenu = async () => {
  const response = await api.get('/admin/menus/authorized');
  return response.data;
};

const getParentMenu = async (id) => {
  const response = await api.get(`/admin/menus/parents?excludedId=${id}`);
  return response.data;
};

const getSingleMenu = async (id) => {
  const response = await api.get(`/admin/menus/${id}`);
  return response.data;
};

const getFavoriteMenu = async () => {
  const response = await api.get('/admin/menus/favorite');
  return response.data;
};

const getUrlPermissions = async (payload) => {
  const response = await api.post('/admin/menu-auth/authorized-menu', payload);
  return response.data;
};

const getButtonPermission = async (payload) => {
  const response = await api.post('/admin/menu-auth/authorized-button', payload);
  return response.data;
};

const createMenu = async (payload) => {
  const response = await api.post('/admin/menus', payload);
  return response.data;
};

const createFavoriteMenu = async (payload) => {
  const response = await api.post('/admin/menus/favorite', payload);
  return response.data;
};

const updateMenu = async (payload) => {
  const response = await api.patch('/admin/menus', payload);
  return response.data;
};

const deleteFavoriteMenu = async (id) => {
  const response = await api.delete(`/admin/menus/favorite/${id}`);
  return response.data;
};

const deleteSingleMenu = async (id, deleted) => {
  const response = await api.patch(`/admin/menus/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const deleteMultipleMenu = async (ids, deleted) => {
  const response = await api.patch(`/admin/menus/deleted/${deleted}`, ids);
  return response.data;
};

export default {
  getMenuList,
  getAuthorizedMenu,
  getParentMenu,
  getSingleMenu,
  getFavoriteMenu,
  getUrlPermissions,
  getButtonPermission,
  createMenu,
  createFavoriteMenu,
  updateMenu,
  deleteFavoriteMenu,
  deleteSingleMenu,
  deleteMultipleMenu,
};
