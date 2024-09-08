import { ToastContainer } from "react-toastify";
import ProjectOwner from "./pages/projectform";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Auth from "./pages/auth";
import ProtectedRoute from "./components/protectedroute";
import AccountSettings from "./pages/projects/account/index";
import Security from "./pages/projects/account/Views/Security";
// import UserRolesPage from "./pages/projects/account/Views/manage/Roles";
// import Manage from "./pages/projects/account/Views/manage/Manage";
import useRole, { UserRoles } from "Hooks/useRole";
import NotFound from "pages/NotFound";
import Team from "components/projects/Team";
import Bids from "components/projects/bids";
import Home from "components/projects/home";
import Members from "components/projects/Team/Views/Members";
import ProjectManagement from "./components/projects/management";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import Meetings from "components/projects/Team/Views/Meetings";
import Chats from "components/projects/Team/Views/Chats";
import Details from "components/projects/bids/portfoliomanager/details";
import Uploads from "components/projects/bids/portfoliomanager/uploads";
import ProjectOwnerBids from "components/projects/bids/projectowner/bid";
import ProjectManagerContractor from "components/projects/bids/portfoliomanager/contractor";
import { checkAvailability } from "components/projects/bids/portfoliomanager/TabComponent";
import ProjectOwnerProcess from "components/projects/bids/projectowner/ProjectOwner";
import OngoingBid from "components/projects/bids/projectowner/OngoingBid";
import MainBid from "./components/projects/bids/contractor/pages/MainBid";
import DocumentsRepo from "components/projects/documents/document-repo";
import BidProcess from "components/projects/bids/projectowner";
import Drawings from "components/projects/documents/drawings";
import Documents from "components/projects/documents";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Pics from "components/projects/photos/pics";
import Photos from "components/projects/photos";
import { useAppSelector } from "store/hooks";
import { StoreContext } from "./context";
import Checklist from "components/projects/bids/portfoliomanager/checklist";
// import Financials from "components/projects/financials";
import FinanceProjects from "components/projects/financials/Projects";
import FinancialInfoPage from "components/projects/financials/FinancialInfoPage";
import DisbursementPlan from "components/projects/financials/DisbursementPlan";
import ActivePOW from "./components/projects/management/POW";
import { PMStoreProvider } from "./components/projects/management/Context";
import Task from "./components/projects/management/POW/Components/Task";
import OneProjects from "./pages/projects/Project/OneProject";
import Templates from "pages/projects/Home/Prototypes";
// import Tutorials from "pages/projects/Home/Tutorials";
import Notification from "pages/projects/Home/Notification";
import AllProjects from "pages/projects/Home/Projects";
import ProjectsHome from "./pages/projects";
import Preferences from "pages/projects/account/Views/Preferences";
import PersonalInfo from "pages/projects/account/Views/PersonalInfo";

import Snapshot from "pages/projects/Home/Components/Snapshot";
import Professionals from "pages/projects/Home/Components/professionals/index";
import PersonaList from "pages/projects/Home/Components/Persona";
import NewTask from "components/projects/management/POW/Components/NewTask";
import useManagerAndProfessionals from "Hooks/useManagersAndDevelopers";
import { ProjectHomeIndex } from "pages/projects/Home";
import useNotifications from "Hooks/useNotifications";
import Create from "pages/projects/Home/Components/Create";
import Referral from "pages/projects/referral";
import ReferralEarn from "pages/projects/referral/Earn";
import ReferralHistory from "pages/projects/referral/History";
import Withdrawals from "pages/projects/referral/withdrawals";
import AdminReferrals from "pages/projects/referral/Admin";
import Clusters from "pages/projects/Clusters";
import BuildingTypes from "pages/projects/Clusters/BuildingTypes";
import ClusterMembers from "pages/projects/Clusters/ClusterMembers";
import BookKeeping from "components/projects/financials/book-keeping/BookKeeping";
import NoContent from "components/projects/photos/NoContent";
import ProcurementLayout from "components/projects/procurement/layout";
import MaterialSchedule from "components/projects/procurement/material-schedule/MaterialSchedule";
import InventoryRegister from "components/projects/procurement/inventory/Inventory";
import Supply from "components/projects/procurement/supply/Supply";
import { DashboardPage } from "components/projects/procurement/dashboard/DashboardPage";

function App() {
  const bid = useAppSelector((m) => m.bid);
  const user = useAppSelector((m) => m.user);
  const { isOwner, isProfessional, canSeeSnapshot } = useRole();
  const { data, selectedProjectIndex, menuProjects, handleContext, isLoading } =
    useContext(StoreContext);
  let navigate = useNavigate();
  const { canUseBookKeeping } = useRole();
  const handleTokenChange = (e: StorageEvent) => {
    if (e.key === null) navigate("/");
    if (e.key === "token" && e.oldValue !== e.newValue) {
      window.location.reload();
    }
  };
  useEffect(() => {
    window.addEventListener("storage", handleTokenChange, false);
    return () => {
      window.removeEventListener("storage", handleTokenChange, false);
    };
  }, []);

  const DocumentRoute = (
    <Route path="documents" element={<Documents />}>
      <Route index element={<DocumentsRepo />} />
      <Route path=":id/*" element={<Drawings />} />
    </Route>
  );

  const PhotosRoute = (
    <Route path="photos" element={<Photos />}>
      <Route index element={<Pics />} />
    </Route>
  );

  const TeamRoute = (
    <Route path="communication" element={<Team />}>
      <Route path="chats/:userId?" element={<Chats />} />
      <Route path="meetings" element={<Meetings />} />
      <Route path="team" element={<Members />} />
      <Route index element={<Navigate to="team" />} />
    </Route>
  );

  const PMRoute = (
    <Route
      path="management"
      element={
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      }
    >
      <Route index element={<ProjectManagement />} />
      <Route path=":powId" element={<ActivePOW />} />
      <Route path=":powId/task/:taskId" element={<Task />} />
      <Route path=":powId/newTask/:newTaskId" element={<NewTask />} />
    </Route>
  );

  const Financial = (
    <Route
      path="financials"
      element={
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      }
    >
      <Route index element={<FinanceProjects />} />
      {canUseBookKeeping && (
        <Route path="book-keeping" element={<BookKeeping />} />
      )}
      <Route path=":finacialId" element={<FinancialInfoPage />} />
      <Route
        path=":finacialId/disbursement-plan"
        element={<DisbursementPlan />}
      />
    </Route>
  );

  const RoutesByRole = useMemo(() => {
    const routes = [
      {
        path: "/projects/management",
        route: PMRoute,
      },
      {
        path: "/projects/documents",
        route: DocumentRoute,
      },
      {
        path: "/projects/photos",
        route: PhotosRoute,
      },
      {
        path: "/projects/communication",
        route: TeamRoute,
      },
      {
        path: "/projects/financials",
        route: Financial,
      },
    ];

    // if user not a professional show all links
    if (!isProfessional || !menuProjects[0]) return routes;

    const projectId = window.location.pathname.split("/")[2];

    if (projectId) {
      // check if s/he has won a bid ( By being a part of the Team)
      const project = menuProjects[selectedProjectIndex];

      if (!project || project._id !== projectId) {
        /**
         * by default we have a selected index
         * when that doesn't match the url provided id
         * ? change the selected project's index
         * if not found
         * ! return empty routes array
         */
        const match = { index: 0, found: false };

        for (let i = 0; i <= menuProjects.length; i++) {
          if (menuProjects[i] && menuProjects[i]._id === projectId) {
            match.found = true;
            match.index = i;
            break;
          }
        }

        if (match.found) {
          handleContext("selectedProjectIndex", match.index);
          return routes;
        }

        return [];
      }

      let isPartOfTheTeam = project.team.find(
        (member) => member.id === user._id
      );
      //
      if (isPartOfTheTeam) return routes;
    }

    return [];
  }, [
    selectedProjectIndex,
    isProfessional,
    handleContext,
    DocumentRoute,
    menuProjects,
    PhotosRoute,
    TeamRoute,
    PMRoute,
    user,
  ]);

  return (
    <div className="w-screen h-screen no-scrollbar">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/projectform"
          element={
            <ProtectedRoute>
              <ProjectOwner />
            </ProtectedRoute>
          }
        />
        <Route path="/clusters" element={<div>{<Outlet />}</div>}>
          <Route path={`:id`} element={<Clusters />}>
            <Route index path="projects" element={<BuildingTypes />} />
            <Route path="members" element={<ClusterMembers />} />
            <Route
              path="*"
              element={<NoContent title="Coming Soon" subtitle="  " />}
            />
          </Route>
        </Route>

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsOutlet />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<ProjectsHome />}>
            <Route index element={<Navigate to={"snapshot"} />} />
            <Route path="create" element={<Create />} />

            <Route
              path="snapshot"
              element={!canSeeSnapshot ? <ProjectHomeIndex /> : <Snapshot />}
            />

            <Route
              path="projectManagers"
              element={<PersonaList UserRole={UserRoles.ProjectManager} />}
            />
            <Route
              path="developers"
              element={<PersonaList UserRole={UserRoles.Developer} />}
            />
            <Route path="professionals" element={<Professionals />} />
          </Route>
          <Route path="all" element={<Outlet />}>
            <Route index path="" element={<AllProjects />} />
          </Route>

          <Route path="prototypes" element={<Templates />} />
          <Route path="notifications" element={<Notification />} />
          <Route index element={<Navigate to="home" />} />
          <Route path=":projectId" element={<OneProjects />}>
            <Route
              path="home"
              element={
                <ErrorBoundary>
                  <Home />
                </ErrorBoundary>
              }
            />
            <Route path="procurement" element={<ProcurementLayout />}>
              <Route index element={<Navigate to="material-schedule" />} />
              <Route path="material-schedule" element={<MaterialSchedule />} />
              <Route path="supply" element={<Supply />} />
              <Route
                path="inventory-register"
                element={<InventoryRegister />}
              />
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>

            <Route
              path="bid"
              element={
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              }
            >
              <Route path=":id" element={<MainBid />} />

              {canSeeSnapshot || isOwner ? (
                <Route index element={<ProjectOwnerBids />} />
              ) : (
                <Route index element={<Bids />} />
              )}

              <Route path="details" element={<Details />}>
                {canSeeSnapshot ? (
                  <>
                    <Route path="uploads" element={<Uploads />} />
                    <Route
                      path="checklist"
                      element={
                        <Checklist
                          loading={data.length < 1}
                          project={data[selectedProjectIndex]?._id}
                          bidId={bid._id}
                        />
                      }
                    />
                    <Route
                      path="invite"
                      element={
                        checkAvailability(bid?.bidDocuments) ? (
                          <ProjectManagerContractor />
                        ) : (
                          <Navigate to="uploads" />
                        )
                      }
                    />

                    <Route
                      path="process"
                      element={
                        bid?.invites?.length ? (
                          <BidProcess />
                        ) : (
                          <Navigate to="invite" />
                        )
                      }
                    >
                      <Route index element={<ProjectOwnerProcess />} />
                      <Route path="ongoing" element={<OngoingBid />} />
                    </Route>
                  </>
                ) : (
                  <>
                    <Route index element={<ProjectOwnerProcess />} />
                    <Route path="ongoing" element={<OngoingBid />} />
                  </>
                )}
              </Route>
            </Route>

            {
              // Conditional render route if a professional is a bid winner
              RoutesByRole.map(({ route }) => (
                <>{route}</>
              ))
            }

            <Route index element={<Navigate to="home" />} />
          </Route>

          <Route path="referrals" element={<Referral />}>
            <Route path="earn" element={<ReferralEarn />} />
            <Route path="admin" element={<AdminReferrals />} />
            <Route path="history" element={<ReferralHistory />} />
            <Route path="withdrawals" element={<Withdrawals />} />
            <Route index element={<Navigate to="earn" />} />
          </Route>

          <Route path="account" element={<AccountSettings />}>
            <Route path="security" element={<Security />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route index element={<Navigate to="personal-info" />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        autoClose={3000}
        position="top-center"
        progressClassName="!bg-transparent"
        bodyStyle={{ marginRight: "20px" }}
        toastClassName="bg-green-500 border !relative"
      />
    </div>
  );
}

const ProjectsOutlet = () => {
  useNotifications();
  useManagerAndProfessionals();
  let navigate = useNavigate();
  let { isOwner } = useRole();
  const [visited, setVisited] = useState(false);
  let { data, isLoading } = useContext(StoreContext);
  useEffect(() => {
    if (!isLoading && data.length < 1 && !visited && isOwner) {
      navigate("/projects/home/create");
      setVisited(true);
    }
  }, [isLoading]);
  return <Outlet />;
};

export default App;

//// "extends": [
//     "react-app",
//     "react-app/jest"
//   ]
