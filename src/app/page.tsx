import { MapComponent } from "@/components/mapComponent";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  return (
    <div>
      <Sidebar />
      <MapComponent />
    </div>
  );
}
