import React from 'react';

import { CBadge, CCol } from '@coreui/react-pro';
import { useToast } from 'context/ToastContext';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import routes from 'routes';
import MenuService from 'services/menu/MenuService';

export const AppSidebarNav = ({ items, refetchMenuList }) => {
  const location = useLocation();
  const { addToast } = useToast();

  const postFavoriteMenu = async (id) => {
    try {
      await MenuService.postFavoriteMenu({ menuId: id });
    } catch (error) {
      addToast({ message: '메뉴를 즐겨찾기에 등록하지 못했습니다.' });
    }
  };

  const deleteFavoriteMenu = async (id) => {
    try {
      await MenuService.deleteFavoriteMenu(id);
    } catch (error) {
      addToast({ message: '메뉴를 즐겨찾기에서 삭제하지 못했습니다.' });
    }
  };

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : false;
  };
  const navItem = (item, index, depth = 0) => {
    const { component, name, badge, icon, isFavorite, favoriteMenuId, id, ...rest } = item;
    const Component = component;
    const indentStyle = {
      paddingLeft: `${(depth + 1) * 16}px`,
    };

    const getClassNameForNavItem = (itemPath, currentPath) => {
      return itemPath === currentPath ? 'active' : undefined;
    };

    return (
      <Component
        {...(rest.to && !rest.items && { component: NavLink })}
        key={index}
        {...rest}
        style={indentStyle}
        className={getClassNameForNavItem(rest.to, location.pathname)}
      >
        {navLink(name, icon, badge)}
        <CCol className="d-grid justify-content-md-end">
          {isFavorite !== undefined &&
            (isFavorite ? (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  void deleteFavoriteMenu(favoriteMenuId);
                  refetchMenuList();
                }}
              >
                ★
              </div>
            ) : (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  void postFavoriteMenu(id);
                  refetchMenuList();
                }}
              >
                ☆
              </div>
            ))}
        </CCol>
      </Component>
    );
  };

  const navGroup = (item, index, depth = 0) => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;
    const hasActiveItem = item.items?.some(
      (subItem) => getRouteName(subItem.to, routes) === getRouteName(location.pathname, routes)
    );
    const indentStyle = {
      paddingLeft: `${depth * 16}px`,
    };

    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        style={indentStyle}
        visible={location.pathname.startsWith(to) ? 'true' : undefined} //REMIND custom props issue
        className={hasActiveItem ? 'show' : undefined}
        {...rest}
      >
        {item.items?.map((subItem, subIndex) =>
          subItem.items ? navGroup(subItem, subIndex, depth + 4) : navItem(subItem, subIndex, depth + 4)
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items && items.map((item, index) => (item.items ? navGroup(item, index, 0) : navItem(item, index, 0)))}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
