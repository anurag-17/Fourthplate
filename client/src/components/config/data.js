import Dashboard from "../admin-pages/Dashboard";
import SubAdmin from "../admin-pages/sub-admin/page";
import User from "../admin-pages/user/User";
import Setting from "../auth/setting";
import AllEvent from "../evet";
import SubAdminDashboard from "../subAdmin-pages/Dashboard";
export const sideMenus = [
  {
    id: 0,
    label: "Dashboard",
    component: <Dashboard />,
    url: "/",
    // icon: <DashboardIcon />,
  },
  {
    id: 1,
    label: "SubAdmin list",
    component: <SubAdmin />,
  },
  {
    id: 2,
    label: "User list",
    component: <User />,
    // url: "/",
  },
  {
    id: 3,
    label: "Events",
    component: <AllEvent />,
    // url: "/",
  },
  {
    id: 4,
    label: "Setting",
    component: <Setting />,
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
export const subAdminSideMenus = [
  {
    id: 0,
    label: "Dashboard",
    component: <SubAdminDashboard />,
    url: "/",
    // icon: <DashboardIcon />,
  },
  {
    id: 1,
    label: "User list",
    component: <User />,
    // url: "/",
  },
];
