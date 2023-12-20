import { Container, Stack } from "@mui/material";
import { PageHeader } from "../../components/PageHeader";
import { Shelf, ShelfConfig } from "./Shelf";

const bigKallax = {
  width: 24,
  height: 48,
  columns: 2,
  rows: 4,
};

const smallKallax = {
  width: 12,
  height: 48,
  columns: 1,
  rows: 4,
};

const shelves: ShelfConfig[] = [
  {
    name: "TwoPlayer",
    ...smallKallax,
  },
  {
    name: "Coop",
    ...bigKallax,
  },
  {
    name: "Adventure",
    ...bigKallax,
  },
  {
    name: "Drafting",
    ...bigKallax,
  },
  {
    name: "DnD",
    ...smallKallax,
  },
];

export const ShelvesPage = () => {
  return (
    <>
      <PageHeader text="Shelves" />
      <Container maxWidth="xl">
        <Stack direction={"row"} spacing="0">
          {shelves.map((config) => (
            <Shelf config={config} key={config.name} />
          ))}
        </Stack>
      </Container>
    </>
  );
};
