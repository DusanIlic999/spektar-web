import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "./context/modal.provider.tsx";
import { FullSizeImageProvider } from "./context/full.image.provider.tsx";
import { ChatSocketProvider } from "./context/chat/socket.provider.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: 3,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChatSocketProvider>
        <FullSizeImageProvider>
          <ModalProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ModalProvider>
        </FullSizeImageProvider>
      </ChatSocketProvider>
    </QueryClientProvider>
  </StrictMode>,
);
