import { DynamicHookComponent } from "./_components/dynamicHook";
import { Wallet } from "./_components/wallet";

export default function Home() {
  return (
    <main>
      <Wallet/>  
      <DynamicHookComponent/>    
    </main>
  );
}
