import "./globals.css";
import { AuthContextProvider } from "./utils/auth-context";

export const metadata = {
  title: "NewLeaf",
  description: "Animal Community Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}