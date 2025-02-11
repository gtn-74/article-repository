import { Switch } from "@mui/material";
import { nextYearSalary } from "../utils/func-type";

export default function Sample() {

  // default-parameters
  console.log(nextYearSalary(1000, 1.05));

  return <Switch color="secondary" />;
}
