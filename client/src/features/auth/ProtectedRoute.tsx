import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { selectCurrentUserId, setRedirect } from "./authSlice";

const nonAuthorizedPath = [
    "/",
    "/login",
    "/signup"
]

const ProtectedRoute = ({ children }: { children: React.ReactNode}) => {
    const userId = useAppSelector(selectCurrentUserId);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const redirect = useAppSelector((state: RootState) => state.auth.redirect);
    const [navigateTo, setNavigateTo] = useState<string | null>(null);
    
    useEffect(() => {
        if (!userId && !nonAuthorizedPath.includes(location.pathname)) {
            dispatch(setRedirect(location.pathname));
            setNavigateTo("/");  // Instead of returning Navigate directly
        } else if (userId && nonAuthorizedPath.includes(location.pathname)) {
            if (redirect) {
                setNavigateTo(redirect); // Redirect to saved path
                dispatch(setRedirect(null));
            } else {
                setNavigateTo("/dashboard"); // Default redirect
            }
        } else {
            setNavigateTo(null); // No navigation required
        }
    }, [userId, location.pathname, redirect, dispatch]);

    if (navigateTo) {
        return <Navigate to={navigateTo} />;
    }

    return children;
}

export default ProtectedRoute;