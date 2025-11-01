// pages/aura.tsx
import bghands1 from "@/assets/images/backgrounds/bg-hands-1.png";
import bghands2 from "@/assets/bg-aura/bg-hands-2.png";
import bghands3 from "@/assets/bg-aura/bg-hands-3.png";
import bghands4 from "@/assets/bg-aura/bg-hands-4.png";
import AdminPanel from "@/components/sections/AdminPanel";
import AuraBox from "@/components/sections/AuraBox";
import ImprovementShop from "@/components/sections/ImprovementShop";
import UpgradeShop from "@/components/sections/UpgradeShop";

const Aura = () => {
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-gray-950"
      onDragStart={(e) => e.preventDefault()}
    >
      <AdminPanel />

      <div className="absolute inset-0 z-0">
        <img
          src={bghands1}
          alt="Fundo místico com mãos"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl min-h-screen p-4">
        <div className="absolute top-4 left-0 right-0 w-full px-4">
          <ImprovementShop />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <AuraBox />
        </div>

        <div className="absolute bottom-4 left-0 right-0 w-full px-4">
          <div className="relative">
            <UpgradeShop />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aura;
