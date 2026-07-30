import { Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import { Layout } from "./components/Layout";
import { Fallback } from "./components/fallback/Fallback";
import ScrollToTop from "./components/ScrollToTop";

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
const ProfileEditPage = lazy(() =>
  import("./pages").then((module) => ({ default: module.ProfileEditPage })),
);

function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />}></Route>
          <Route path="/chat" element={<ChatPage />}></Route>
          <Route path="/notification" element={<NotificationPage />}></Route>
          <Route path="/saved" element={<SavedPage />}></Route>
          <Route path="/search" element={<SearchPage />}></Route>
          <Route path="/settings" element={<SettingsPage />}></Route>
          <Route path="/tranding" element={<TrandingPage />}></Route>
          <Route
            path="/create-community"
            element={<CreateCommunityFormPage />}
          ></Route>
          <Route path="/communities" element={<CommunitesPage />}></Route>
          <Route path="/community/:slug" element={<CommunityPage />}></Route>
          <Route path="/post/:id" element={<PostPage />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profile/:username" element={<Profile />}></Route>
          <Route path="/profile/edit" element={<ProfileEditPage />}></Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
