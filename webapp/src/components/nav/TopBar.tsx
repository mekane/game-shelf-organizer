import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

const MenuButton = styled(Button)({
  my: 2,
  color: "white",
  display: "block",
});

const NavButton = ({ label, path }: { label: string; path: string }) => {
  return (
    <MenuButton color="inherit">
      <NavLink
        to={path}
        style={({ isActive, isPending }) => {
          return {
            color: isActive ? "red" : "inherit",
            textDecoration: "none",
          };
        }}
      >
        {label}
      </NavLink>
    </MenuButton>
  );
};

export const TopBar = () => {
  return (
    <AppBar position="static" className={"appBar"}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            paddingRight="40px"
          >
            Board Game Organizer
          </Typography>

          <NavButton label="Home" path="/" />
          <NavButton label="Collection" path="/collection" />
          <NavButton label="Lists" path="/lists" />
          <NavButton label="Shelves" path="/shelves" />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
