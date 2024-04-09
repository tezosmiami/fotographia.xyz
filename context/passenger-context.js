import React, { useEffect, useState, useCallback} from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

const PassengerContext = React.createContext();
const options = {
  name: 'foto∙graphia.xyz'
 };
  
if (process.browser){
  const wallet = new BeaconWallet(options);
}

export const usePassengerContext = () => {

  const app = React.useContext(PassengerContext);
  if (!app) {
    throw new Error(
      `!app`
    );
  }
  return app;
};

export const PassengerContextProvider = ({ children }) => {
  
  const [app, setApp] = React.useState("");
  const [address, setAddress] = useState("");
  const [tezos, setTezos] = useState(new TezosToolkit("https://mainnet.api.tez.ie"));
  const [activeAccount, setActiveAccount] = useState("")


  useEffect( () => {

     const getLoggedIn = async () => {
        if (await wallet?.client.getActiveAccount()) { 
          setActiveAccount(await wallet.client.getActiveAccount());
          const address =  await wallet.getPKH();
          setAddress(address);
          tezos.setWalletProvider(wallet);
          setTezos(tezos)
        }
      };
      getLoggedIn();
    }, []);
  
  async function logIn() {
    app.currentUser && await app.currentUser.logOut();
    await wallet.client.clearActiveAccount();
    await wallet.client.requestPermissions({
      network: {
        type: 'mainnet',
      },
    });
    tezos.setWalletProvider(wallet);
    setTezos(tezos)
    setAddress(await wallet.getPKH());
    setActiveAccount(await wallet?.client?.getActiveAccount());
    
  }

  async function logOut() {
    await wallet.client.clearActiveAccount();
    setActiveAccount("")
    setAddress("");
   window.location.reload();
  }
  async function collect(swapId, xtzAmount) {
    try {
        const v2 = await tezos.wallet.at('KT1HbQepzV1nVGg8QVznG7z4RcHseD5kwqBn');
        const op = await v2.methodsObject
            .collect(parseFloat(swapId))
            .send({
                amount: parseFloat(xtzAmount),
                mutez: true,
                storageLimit: 310
            });
        await op.confirmation(2);
    } catch(e) {
        console.log('Error:', e);
        return false;
    }
    return true;
};

  const wrapped = { ...app, tezos, logIn, logOut, collect, activeAccount, address};

  return (
   
    <PassengerContext.Provider value={wrapped}>
           {children}
    </PassengerContext.Provider>
  
  );
};

export default PassengerContextProvider;