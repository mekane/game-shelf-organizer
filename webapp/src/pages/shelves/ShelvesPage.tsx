import { Container, Stack } from "@mui/material";
import { PageHeader } from "../../components/PageHeader";
import { Shelf, ShelfDisplay } from "../../components/shelf/ShelfDisplay";

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

const shelves: Shelf[] = [
  {
    id: "s0",
    name: "TwoPlayer",
    ...smallKallax,
  },
  {
    id: "s1",
    name: "Coop",
    ...bigKallax,
  },
  {
    id: "s2",
    name: "Adventure",
    ...bigKallax,
  },
  {
    id: "s3",
    name: "Drafting",
    ...bigKallax,
  },
  {
    id: "s4",
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
            <ShelfDisplay shelf={config} key={config.name} />
          ))}
        </Stack>
      </Container>
    </>
  );
};
