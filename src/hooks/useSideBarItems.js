import { useEffect, useState } from 'react';

import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react-pro';

import MenuService from '../services/menu/MenuService';
import { iconMapper } from '../utils/common/iconMapper';

const fixedMenu = [
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
    component: CNavTitle,
    name: '메뉴',
  },
];

const transformDataToMenuItems = (data) => {
  return data
    .filter((item) => item.parentId === 0)
    .map((parentItem) => {
      const hasChildren = data.some((childItem) => childItem.parentId === parentItem.id);

      if (hasChildren) {
        return {
          component: CNavGroup,
          name: parentItem.name,
          icon: iconMapper({ iconName: parentItem.icon, type: 'nav' }),
          items: data
            .filter((childItem) => childItem.parentId === parentItem.id)
            .map((childItem) => ({
              component: CNavItem,
              name: childItem.name,
              to: childItem.urlPath,
            })),
        };
      } else {
        return {
          component: CNavItem,
          name: parentItem.name,
          to: parentItem.urlPath,
          icon: iconMapper({ iconName: parentItem.icon, type: 'nav' }),
        };
      }
    });
};

const useSideBarItems = () => {
  const [menuItems, setMenuItems] = useState([]);

  const getMenuList = async () => {
    try {
      const data = await MenuService.getAuthorizedMenu();
      const transformedMenuItems = transformDataToMenuItems(data);
      setMenuItems([...fixedMenu, ...transformedMenuItems]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMenuList();
  }, []);

  return menuItems;
};

export default useSideBarItems;
