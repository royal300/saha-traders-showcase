import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { trackVisitorFn } from "@/lib/server-functions";
import { hydrateCatalog } from "@/lib/products";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Saha Marble & Tiles — Premium Tiles & Bathroom Fittings in Barasat" },
      { name: "description", content: "Saha Marble & Tiles offers premium floor tiles, wall tiles, basins, commodes, taps and sinks in Barasat. Crafting Spaces, Defining Excellence." },
      { name: "author", content: "Saha Marble & Tiles" },
      { property: "og:title", content: "Saha Marble & Tiles — Premium Tiles & Bathroom Fittings in Barasat" },
      { property: "og:description", content: "Saha Marble & Tiles offers premium floor tiles, wall tiles, basins, commodes, taps and sinks in Barasat. Crafting Spaces, Defining Excellence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Saha Marble & Tiles — Premium Tiles & Bathroom Fittings in Barasat" },
      { name: "twitter:description", content: "Saha Marble & Tiles offers premium floor tiles, wall tiles, basins, commodes, taps and sinks in Barasat. Crafting Spaces, Defining Excellence." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f63d2821-5ad5-472f-8b66-982cf72dd00a/id-preview-b55862eb--df28b93e-bb03-4847-b87c-17e793778d92.lovable.app-1779215451053.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f63d2821-5ad5-472f-8b66-982cf72dd00a/id-preview-b55862eb--df28b93e-bb03-4847-b87c-17e793778d92.lovable.app-1779215451053.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  React.useEffect(() => {
    // Hydrate catalog from database
    hydrateCatalog().catch(err => console.error("Error hydrating catalog:", err));
    // Log unique visitor IP securely
    trackVisitorFn().catch(err => console.error("Error tracking visitor:", err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <CartDrawer />
        <FloatingCartBar />
      </CartProvider>
    </QueryClientProvider>
  );
}
