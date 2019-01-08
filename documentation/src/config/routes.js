import React from "react";

const routes = {
  nails_commands: {
    label: "Nails Commands",
    path: "/nails-commands",
    subMenuItemList: {
      generations: {
        label: "Generations",
        path: "/nails-commands/generations",
        subMenuItemList: {
          scaffold: {
            label: "scaffold",
            path: "/nails-commands/generations/scaffold",
            screen: () => <div>scaffold</div>
          },
          migration: {
            label: "migration",
            path: "/nails-commands/generations/migration",
            screen: () => <div>migration</div>
          }
        }
      },
      database: {
        label: "Database",
        path: "/nails-commands/database",
        subMenuItemList: {
          migrate: {
            label: "Migrate",
            path: "/nails-commands/database/migrate",
            screen: () => <div>migrate</div>
          },
          rollback: {
            label: "Rollback",
            path: "/nails-commands/database/rollback",
            screen: () => <div>rollback</div>
          }
        }
      }
    }
  },
  nails_schema: {
    label: "nails schema",
    path: "/nails-schema",
    screen: () => <div>nails schema</div>
  }
};

export default routes;
