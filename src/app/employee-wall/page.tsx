import { redirect } from "next/navigation";

// Legacy route — functionality moved to home page
export default function EmployeeWallPage() {
  redirect("/#clock-in");
}
