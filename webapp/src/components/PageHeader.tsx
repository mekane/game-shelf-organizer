import { Typography } from "@mui/material";

export const PageHeader = ({ text }: { text: string }) => {
  return (
    <Typography
      component="h1"
      variant="h3"
      color="primary"
      noWrap
      paddingLeft="40px"
    >
      {text}
    </Typography>
  );
};
