import { useState } from "react";
import { AuthContext } from "./AuthContext";

// hard code this for now, later will need a login page to submit the user+pass form and store this result
const hardCodedAuthToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoxLCJ1c2VybmFtZSI6Im1hcnR5LmthbmVAZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiYmdnVXNlck5hbWUiOiJtZWthbmUiLCJpYXQiOjE3NzcyNTg0Mjd9.dFGq-aieoKPTdXYF3DB3I8KVqSfe52B_CGYm3NeiqUM";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState(hardCodedAuthToken);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState({});

  const logout = async () => {
    setAuthed(false);
    setUser(undefined);
    setAccessToken(undefined);
    return true;
  };

  const value = {
    authed,
    accessToken,
    logout,
    setAccessToken,
    setUser,
    user,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
};
