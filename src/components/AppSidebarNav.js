import React from 'react';

import { CBadge, CCol } from '@coreui/react-pro';
import { useToast } from 'context/ToastContext';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
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

  const navItem = (item, index) => {
    const { component, name, badge, icon, isFavorite, favoriteMenuId, id, ...rest } = item;
    const Component = component;

    return (
      <Component {...(rest.to && !rest.items && { component: NavLink })} key={index} {...rest}>
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

  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;

    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items && items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
