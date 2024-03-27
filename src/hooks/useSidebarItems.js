import { useEffect, useState } from 'react';

import { CNavGroup, CNavGroupItems, CNavItem, CNavTitle } from '@coreui/react-pro';
import { useToast } from 'context/ToastContext';
import MenuService from 'services/menu/MenuService';
import { iconMapper } from 'utils/common/iconMapper';

const useSidebarItems = () => {
  const [menuItems, setMenuItems] = useState([]);

  const { addToast } = useToast();

  const getMenuList = async () => {
    try {
      const menuList = await MenuService.getAuthorizedMenus();
      const favoriteMenuList = await MenuService.getFavoriteMenus();

      const menuListWithFavorites = menuList.map((menu) => {
        const favorite = favoriteMenuList.find((fav) => fav.menuId === menu.id);
        return {
          ...menu,
          isFavorite: !!favorite,
          favoriteMenuId: favorite ? favorite.id : null,
        };
      });

      const favoriteItems = menuListWithFavorites
        .filter((menu) => menu.isFavorite)
        .map((menu) => ({
          component: CNavItem,
          name: menu.name,
          to: menu.urlPath,
          icon: iconMapper({ iconName: menu.icon, type: 'nav' }),
          isFavorite: menu.isFavorite,
          favoriteMenuId: menu.favoriteMenuId,
        }));

      const transformedMenuItems = menuListWithFavorites.reduce((acc, menu) => {
        if (menu.parentId === 0) {
          const children = menuListWithFavorites.filter((child) => child.parentId === menu.id);
          if (menu.allowChildren) {
            acc.push({
              component: CNavGroup,
              name: menu.name,
              icon: iconMapper({ iconName: menu.icon, type: 'nav' }),
              items: children.map((child) => ({
                component: CNavItem,
                name: child.name,
                to: child.urlPath,
                icon: iconMapper({ iconName: child.icon, type: 'nav' }),
                id: child.id,
                isFavorite: child.isFavorite,
                favoriteMenuId: child.favoriteMenuId,
              })),
            });
          } else {
            acc.push({
              component: CNavItem,
              name: menu.name,
              to: menu.urlPath,
              icon: iconMapper({ iconName: menu.icon, type: 'nav' }),
              id: menu.id,
              isFavorite: menu.isFavorite,
              favoriteMenuId: menu.favoriteMenuId,
            });
          }
        }
        return acc;
      }, []);

      const sidebarItems = [
        {
          component: CNavItem,
          name: '대시보드',
          to: '/dashboard',
          icon: iconMapper({ iconName: 'cilSpeedometer', type: 'nav' }),
        },
        {
          component: CNavTitle,
          name: '즐겨찾기',
        },
        {
          component: CNavGroupItems,
          name: '즐겨찾기',
          active: 'false', //REMIND custom props boolean value issue
          icon: iconMapper({ iconName: 'cilStar', type: 'nav' }),
          items: favoriteItems,
        },
        { component: CNavTitle, name: '메뉴' },
        ...transformedMenuItems,
      ];

      setMenuItems(sidebarItems);
    } catch (error) {
      addToast({ message: '메뉴를 가져오지 못했습니다.' });
    }
  };

  useEffect(() => {
    void getMenuList();
  }, []);

  return { menuItems, refetchMenuList: getMenuList };
};

export default useSidebarItems;
