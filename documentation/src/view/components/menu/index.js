import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import MenuItem from "view/components/menu-item";
import styles from "./menu-styles.module.scss";

const MenuItemList = ({
  menuItems,
  setActivePath,
  activePath,
  selectedPath
}) => {
  const items = Object.keys(menuItems);

  return (
    <ul className={styles.menuItemList}>
      {items.map(key => {
        return (
          <MenuItem
            activePath={activePath}
            selectedPath={selectedPath}
            setActivePath={setActivePath}
            key={"menu-item=" + menuItems[key].path}
            menuItem={menuItems[key]}
            MenuItemList={MenuItemList}
          />
        );
      })}
    </ul>
  );
};

class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activePath: "",
      selectedPath: ""
    };
  }

  setActivePath = (path, screen) => {
    const selectedPath = path;
    let activePath = path;
    if (activePath === this.state.activePath) {
      activePath.split("/")[1];
      activePath = "/" + activePath.split("/")[1];
    }
    this.setState({ activePath, selectedPath });
  };

  render() {
    return (
      <div>
        <MenuItemList
          menuItems={this.props.menuItems}
          setActivePath={this.setActivePath}
          activePath={this.state.activePath}
          selectedPath={this.state.selectedPath}
        />
      </div>
    );
  }
}

export default withRouter(Menu);
