import Header from "@/components/header";
import Tabs from "@/components/micros/tabs";

export default function Home() {
  return (
    <div>
    <Header />
    <div className="px-4 py-3">
      <p>Earn points, unlock rewards, and celebrate your  progress!</p>
    <Tabs />
    </div>
    </div>
  );
}
