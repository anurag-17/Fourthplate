
import Dashboard from "../admin-pages/Dashboard";
import User from "../admin-pages/user/User"
export const sideMenus = [
  {
    id: 0,
    label: "Dashboard",
    component : <Dashboard />,
    url: "/",
    // icon: <DashboardIcon />,
  },
  {
    id: 1,
    label: "User list",
    component : <User />,
    // url: "/",
  },
  // {
  //   id: 2,
  //   label: "Property list",
  //   // component : <Property />,
  // },
  // {
  //   id: 3,
  //   label: "Property list",
  //   // component : <Property />,
  // },
];
