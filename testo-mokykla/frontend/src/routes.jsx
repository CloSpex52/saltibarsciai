import PrivateRoutes from "./utils/PrivateRoutes";
import PublicRoutes from "./utils/PublicRoutes";

import {
  Email,
  Slaptazodis,
  Prisijungimas,
  Registracija,
  Pagrindinis,
  Naujienos,
  Apie,
  Kontaktai,
  Profilis,
  CategoryCreate,
  TeachHub,
  ManageCategories,
  ManageQuizes,
  ManageGroups,
  Group,
  EditGroups,
  EditGroup,
  StudentHub,
  DoneQuizes,
  TakeQuizes,
  GivenGrades,
  YourGroups,
  NeraPuslapio,
  CategoryTemplate,
  CreateQuiz,
  EditQuiz,
  EditQuizzes,
  YourQuizzes,
  CheckGrades,
  EditCategories,
  CheckQuiz,
} from "./Pages";

export const allRoutes = [
  { path: "/naujienos", element: <Naujienos /> },
  { path: "/apie", element: <Apie /> },
  { path: "/kontaktai", element: <Kontaktai /> },
  { path: "/*", element: <NeraPuslapio /> },
];

export const allPrivateRoutes = [
  {
    element: <PrivateRoutes />,
    children: [
      { path: "/", element: <Pagrindinis /> },
      { path: "/profilis", element: <Profilis /> },
      { path: "/category/:categoryId", element: <CategoryTemplate /> },
    ],
  },
];

export const allPublicRoutes = [
  {
    element: <PublicRoutes />,
      children: [
      { path: "email", element: <Email /> },
      { path: "slaptazodis", element: <Slaptazodis /> },
      { path: "prisijungimas", element: <Prisijungimas /> },
      { path: "registracija", element: <Registracija /> },
    ],
  },
];

export const allTeacherRoutes = [
  {
    element: <PrivateRoutes />,
    children: [
      { path: "/valdymas/mokytojas", element: <TeachHub /> },
      {
        path: "/valdymas/mokytojas/tvarkyti/kategorijas/kurti",
        element: <CategoryCreate />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/kategorijas",
        element: <ManageCategories />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/testus",
        element: <ManageQuizes />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/kategorijas/redaguoti",
        element: <EditCategories />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/grupes",
        element: <ManageGroups />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/grupes/kurti",
        element: <Group />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/grupes/redaguoti",
        element: <EditGroups />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/grupes/redaguoti/:groupId",
        element: <EditGroup />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/testai/kurti",
        element: <CreateQuiz />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/testai/redaguoti/:quizId",
        element: <EditQuiz />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/testai/peržiūra",
        element: <EditQuizzes />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/grupes/įvertinimai",
        element: <CheckGrades />,
      },
      {
        path: "/valdymas/mokytojas/tvarkyti/grupes/įvertinimai/:quizId/:userId",
        element: <CheckQuiz />,
      },
    ],
  },
];

export const allStudentRoutes = [
  {
    element: <PrivateRoutes />,
    children: [
      { path: "/valdymas/mokinys", element: <StudentHub /> },
      { path: "/valdymas/mokinys/grupės", element: <YourGroups /> },
      {
        path: "/valdymas/mokinys/testai/daryti/:quizId",
        element: <TakeQuizes />,
      },
      { path: "/valdymas/mokinys/ivertinimai", element: <DoneQuizes /> },
      { path: "/valdymas/mokinys/testai", element: <YourQuizzes /> },
      {
        path: "/valdymas/mokinys/ivertinimai/:quizId/:userId",
        element: <GivenGrades />,
      },
    ],
  },
];
