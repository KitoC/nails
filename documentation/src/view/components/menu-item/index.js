import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styles from "./menu-item.module.scss";

const MenuItem = ({
  menuItem,
  activePath,
  selectedPath,
  MenuItemList,
  setActivePath
}) => {
  const { path, label, screen, subMenuItemList } = menuItem;

  const menuLabel = screen ? <Link to={path}>{label}</Link> : <a>{label}</a>;

  const isActive = selectedPath === path ? styles.isActive : styles.navItem;

  return (
    <li>
      <div onClick={() => setActivePath(path, screen)} className={isActive}>
        {menuLabel}
      </div>
      {subMenuItemList && activePath && activePath.includes(path) && (
        <MenuItemList
          activePath={activePath}
          selectedPath={selectedPath}
          menuItems={subMenuItemList}
          setActivePath={setActivePath}
        />
      )}
    </li>
  );
};

export default MenuItem;
