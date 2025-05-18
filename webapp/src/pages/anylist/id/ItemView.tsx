import { AnylistColumns, AnylistOptions } from "@lib/boardgame.api.client";
import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

export interface ItemViewProps {
  item: AnylistColumns;
  options: AnylistOptions;
}

export const ItemView: FC<ItemViewProps> = ({ item, options }) => (
  <Stack
    direction={"row"}
    sx={{ px: 1, width: "100%" }}
    spacing={1}
    className="item-view"
  >
    <Box sx={{ flex: "0 0 40px" }}>
      <img src={item.thumbnail} />
    </Box>
    <Typography sx={{ flex: "0 0 20%" }}>{item.name}</Typography>
    <Typography
      sx={{ flex: "0 0 50px" }}
    >{`${item.rating} / ${options.ratingMax}`}</Typography>
    <Typography sx={{ flex: "0 1 75%" }}>{item.notes}</Typography>
  </Stack>
);
