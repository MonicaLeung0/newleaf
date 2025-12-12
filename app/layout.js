import { AuthContextProvider } from "./utils/auth-context";

export default function AuthLayout({ children })
{
    return <AuthContextProvider>{children}</AuthContextProvider>;
}