import { Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import { Layout } from "./components/Layout";
import { Fallback } from "./components/fallback/Fallback";

const HomePage = lazy(() =>
  import("./pages").then((module) => ({ default: module.HomePage })),
);
const ChatPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.ChatPage })),
);
const NotificationPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.NotificationPage })),
);
const SavedPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.SavedPage })),
);
const SearchPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.SearchPage })),
);
const SettingsPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.SettingsPage })),
);
const TrandingPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.TrandingPage })),
);
const CreateCommunityFormPage = lazy(() =>
  import("./pages").then((module) => ({
    default: module.CreateCommunityFormPage,
  })),
);
const CommunitesPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.CommunitesPage })),
);
const CommunityPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.CommunityPage })),
);
const PostPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.PostPage })),
);
const Profile = lazy(() =>
  import("./pages").then((module) => ({ default: module.Profile })),
);

function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<HomePage />}></Route>
          <Route index path="/chat" element={<ChatPage />}></Route>
          <Route
            index
            path="/notification"
            element={<NotificationPage />}
          ></Route>
          <Route index path="/saved" element={<SavedPage />}></Route>
          <Route index path="/search" element={<SearchPage />}></Route>
          <Route index path="/settings" element={<SettingsPage />}></Route>
          <Route index path="/tranding" element={<TrandingPage />}></Route>
          <Route
            index
            path="/create-community"
            element={<CreateCommunityFormPage />}
          ></Route>
          <Route index path="/communities" element={<CommunitesPage />}></Route>
          <Route
            index
            path="/community/:slug"
            element={<CommunityPage />}
          ></Route>
          <Route index path="/post/:id" element={<PostPage />}></Route>
          <Route index path="/profile" element={<Profile />}></Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
