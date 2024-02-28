import api from 'api/Api';

const getMenus = async (params, pageable) => {
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
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    },
  });
  return response.data;
};

const getAuthorizedMenus = async () => {
  const response = await api.get('/admin/menus/authorized');
  return response.data;
};

const getParentMenus = async (id) => {
  const response = await api.get(`/admin/menus/parents?excludedId=${id}`);
  return response.data;
};

const getMenuDetail = async (id) => {
  const response = await api.get(`/admin/menus/${id}`);
  return response.data;
};

const getFavoriteMenus = async () => {
  const response = await api.get('/admin/menus/favorite');
  return response.data;
};

const postUri = async (payload) => {
  const response = await api.post('/admin/menu-auth/authorized-menu', payload);
  return response.data;
};

const postMenu = async (payload) => {
  const response = await api.post('/admin/menus', payload);
  return response.data;
};

const postFavoriteMenu = async (payload) => {
  const response = await api.post('/admin/menus/favorite', payload);
  return response.data;
};

const patchMenu = async (payload) => {
  const response = await api.patch('/admin/menus', payload);
  return response.data;
};

const deleteFavoriteMenu = async (id) => {
  const response = await api.delete(`/admin/menus/favorite/${id}`);
  return response.data;
};

const deleteMenu = async (id, deleted) => {
  const response = await api.patch(`/admin/menus/${id}/deleted?deleted=${deleted}`);
  return response.data;
};

const deleteMenus = async (ids, deleted) => {
  const response = await api.patch(`/admin/menus/deleted/${deleted}`, ids);
  return response.data;
};

const MenuService = {
  getMenus,
  getAuthorizedMenus,
  getParentMenus,
  getMenuDetail,
  getFavoriteMenus,
  postUri,
  postMenu,
  postFavoriteMenu,
  patchMenu,
  deleteFavoriteMenu,
  deleteMenu,
  deleteMenus,
};

export default MenuService;
