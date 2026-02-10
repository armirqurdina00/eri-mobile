import { getCurrentUser } from "@/actions/auth";
import NewProductClient from "./NewProductClient";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  return <NewProductClient userName={user?.name} />;
}
