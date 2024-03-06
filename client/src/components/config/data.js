
import Dashboard from "../admin-pages/Dashboard";
import User from "../admin-pages/user/User"
import Setting from "../auth/setting";
import AllEvent from "../evet";
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
  {
    id: 2,
    label: "Events",
    component : <AllEvent />,
    // url: "/",
  },
  {
    id: 3,
    label: "Setting",
    component : <Setting />,
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
