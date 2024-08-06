import { DynamicHookComponent } from "./_components/dinamycHook";
import { Wallet } from "./_components/wallet";

export default function Home() {
  return (
    <main>
      <Wallet/>  
      <DynamicHookComponent/>    
    </main>
  );
}
