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

  const navItem = (item, index, depth = 0) => {
    const { component, name, badge, icon, isFavorite, favoriteMenuId, id, ...rest } = item;
    const Component = component;

    return (
      <Component
        {...(rest.to && !rest.items && { component: NavLink })}
        key={index}
        {...rest}
        style={{ ...rest.style, ...getIndentStyle(depth) }}
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

    //TODO 여기서 ClassName 을 붙여주는데 최초 사이드바 렌더링 시 즐겨찾기가 열려있게 기본적으로 세팅되어 있어야한다.
    // 그 후로는 알아서 ... 새로고침하면 즐겨찾기가 열려있게만.
    // navGroup 의 className 을 고정시켜놔도 적용되는건 없다.

    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        style={getIndentStyle(depth)}
        {...rest}
      >
        {item.items?.map((subItem, subIndex) =>
          subItem.items ? navGroup(subItem, subIndex, depth + 1) : navItem(subItem, subIndex, depth + 1)
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items && items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  );
};

const getIndentStyle = (depth) => ({
  paddingLeft: `${depth * 20}px`,
});
AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
