import {
  Home,
  Box,
  DollarSign,
  Tag,
  Clipboard,
  Camera,
  AlignLeft,
  UserPlus,
  Users,
  Chrome,
  BarChart,
  Settings,
  Archive,
  LogIn,
} from "react-feather";
import { useQuery } from "@apollo/client";

var roll = window.localStorage.getItem("user_roll");

export const MENUITEMS = [
  roll == 3
    ? {
        path: "/dashboard",
        title: "대시보드",
        icon: Home,
        type: "link",
        badgeType: "primary",
        active: false,
      }
    : {},
  {
    path: "/assets/download",
    title: "픽맨 예시폼",
    icon: Archive,
    type: "link",
    badgeType: "primary",
    active: false,
  },
  {
    path: "/products/digital/upload-order",
    title: "업로드 및 발주",
    icon: Box,
    type: "link",
    badgeType: "primary",
    active: false,
  },

  {
    path: "/products/digital/view-orders",
    title: "발주내역 보기",
    icon: Users,
    type: "link",
    badgeType: "primary",
    active: false,
  },
  {
    path: "/settings/finishProcess",
    title: "사입완료 및 대량이체",
    icon: Settings,
    type: "link",
    badgeType: "primary",
    active: false,
  },
  {
    path: "/logout",
    title: "로그아웃",
    icon: LogIn,
    type: "link",
    badgeType: "primary",
    active: false,
  },
];
