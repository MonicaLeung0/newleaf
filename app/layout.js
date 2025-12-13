import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./utils/auth-context";

export const metadata = {
  title: "NewLeaf",
  description: "Animal Community Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthContextProvider>
          <Navbar />
          <main>{children}</main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
