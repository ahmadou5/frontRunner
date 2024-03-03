'use client'
import { useState } from "react";
import { Wallet } from "@/suspense/Wallet";
import { Slider } from "@material-tailwind/react";
import { GlobalContext } from "@/context/context";
import { formatAddress } from "@/config/format";
import * as CryptoUtils from '@cmdcode/crypto-utils'

export const Frontrun2 = () => {
  const { address:wallet , wallet:provider } = GlobalContext()
  const [transactionId, setTransactionId] = useState("");
  const [feeRate, setFeeRate] = useState(20);
  const [sliderValue, setSliderValue] = useState(4);
  const [loading, setLoading] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [fees, setFees] = useState({});
  const [ins, setIns] = useState([]);
  const [outs, setOuts] = useState([]);
  const isAddress = true

  const handleChange = (event) => {
    setSliderValue(event.target.value);
    setFeeRate(Math.round(event.target.value * 6));
  }
  const handleShowTransactionData = async () => {
    try {
      let response = await fetch(
        `https://mempool.space/api/tx/${transactionId}`
      );
      const data = await response.json();
      const satsFee = data.vout[0].value;
      const serviceFee = data.vout[1].value;
      const royalty = data.vout[2].value;
      const networkFee = data.fee;
      const feeRate = Math.round((satsFee - 510) / 171);

      let inputs = [];
      let outputs = [];
      data.vin.forEach((element) => {
        inputs.push({
          address: element.prevout.scriptpubkey_address,
          value: element.prevout.value,
        });
      });
      data.vout.forEach((element) => {
        outputs.push({
          address: element.scriptpubkey_address,
          value: element.value,
        });
      });

      setIns(inputs);
      setOuts(outputs);

      setFees({
        satsFee: satsFee,
        serviceFee: serviceFee,
        royalty: royalty,
        networkFee: networkFee,
        feeRate: feeRate,
      });
      setShowTransaction(true);
    } catch (e) {
      alert("Please insert correct transaction id!")
      setShowTransaction(false);
    }
  };

  const frontrun = async () => {



    const cryptoUtils = window.crypto_utils;
    console.log(cryptoUtils)


    
    const url = 'https://api.brc500.com/frontrun';
    const data = {
      transactionId: transactionId,
      address: wallet,
      feeRate: Number(feeRate),
      provider: provider,
      pubkey: wallet
    };

    let response  = await fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    console.log('res', response)
    response = await response.json();
    if (response.status == "success"){
      try{
        if (provider == "unisat")
        {
          let res = await window.unisat.signPsbt(response.psbt);
          // let res1 = "70736274ff0100df0200000001952ce4b725288156ac0730336864ff89ab31d6ed6c72431ff85f21c668156d210100000000fdffffff040714000000000000225120d29c4ea373e66610f952ef4f2c53b72ebd2a4645092bec58ba59140e2ae7fe3da0080000000000002251209b57783ff38333b575f35634ba9795d28dddbe75b0e5fd582974df3b4f0fc37c68100000000000002251200c01e401e1eb5116b0cf41dad123dbc53d70bdb27167b886e86448197f7519367635010000000000225120f28491908b5bb68fe21890d9fb1247103bc53f89964aec64c2fb55a45f570f7a000000000001012b5180010000000000225120f28491908b5bb68fe21890d9fb1247103bc53f89964aec64c2fb55a45f570f7a01030401000000011720e1289efba4a8c5651a079dfc31d405bb7e3406a038706883a85d7e2e326341e40000000000";
          // let res = await window.unisat.signPsbt(res1);
          res = await window.unisat.pushPsbt(res);
          //showInfoMessage(`Order successfully published! ${res}`);
        }
        if (provider == "okxwallet")
        {
          let res = await window.okxwallet.bitcoin.signPsbt(response.psbt);
          res = await window.okxwallet.bitcoin.pushPsbt(res);  
        }
      }
      catch(e)
      {
        console.log('uuu',e);
      }
    }
    else
    {
      alert(response.message);
    }
    setLoading(false);
  }
  return (
    <div className="mt-0 w-[85%]">
      <div className="mt-[230px] flex flex-col h-[1150px] py-1 px-1 lg:w-[80%] w-[95%] ml-auto mr-auto ">
        {/**  <p className="h-12  py-2 px-2 text-xl text-center lg:w-[50%] w-[80%] bg-navBar/45 mt-4 mb-4 rounded-3xl">BRC420 Mint Front Runner</p> */}
        <div className="relative mt-0 flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-yellow-700 before:dark:opacity-10 after:dark:from-[#b99530] after:dark:via-[#ffbb01] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
        <div className="lg:h-[210px] flex w-[97%] flex-col h-auto lg:w-[100%] bg-navBar/35  py-3 px-3 mb-20 mt-4 rounded-3xl ml-auto mr-auto">
          <div className=" ml-auto mr-auto w-[98%] mt-[40px] h-20">
            <div className="h-[60%] mt-auto mb-auto bg-transparent w-[95%] ml-auto mr-auto">
              <input
                onChange={(e) => setTransactionId(e.target.value)}
                className=" h-[100%] w-[100%] outline-none rounded-xl bg-black/35 py-3 px-3"
                type="text"
                placeholder="Input BRC420 Transaction ID"
              />
            </div>
          </div>
          <button onClick={() => handleShowTransactionData()} className="w-[170px] text-lg ml-auto mr-auto bg-[#ffbb01]/70 h-10   rounded-full">
            Retrieve Tx Data
          </button>
        </div>
        {
           showTransaction ?
           <div className="w-[98%] h-[750px] ml-auto mr-auto rounded-2xl bg-navBar/35">
           <div className="w-[97%] h-[95%] py-4 px-4 rounded-2xl ml-auto mr-auto mt-3">
             <div className="h-12 mt-5 text-center flex text-2xl w-[100%]">
               <p className="ml-3 mr-auto">Transaction Data</p>
               <p className="mr-3 ml-auto">{`${feeRate} sats/vB`}</p>
             </div>
             <div className="h-[117px] bg-black/35 rounded-xl py-2 ml-auto mr-auto px-2 mt-12 text-center flex flex-col text-2xl w-[96%]">
                 <p className="font-extrabold mb-5">Inputs Data</p>
                 
                  {
                    ins.map((item,i) => (
                      <>
                      <div key={i} className="flex">
                      <p className="ml-10 mr-auto">{formatAddress(item.address)}</p>
                      <p className="ml-auto mr-10">{`${item.value} sats`}</p>
                      </div>
                      </>
                    ))
                  }
             </div>
             <div className="h-[220px] bg-black/35 rounded-xl py-2 ml-auto mr-auto px-2 mt-12 text-center flex flex-col text-2xl w-[96%]">
                 <p className="font-extrabold mb-5">Outputs Data</p>
                 {
                    outs.map((item,i) => (
                      <>
                      <div key={i} className="flex">
                      <p className="ml-10 mr-auto">{formatAddress(item.address)}</p>
                      <p className="ml-auto mr-10">{`${item.value} sats`}</p>
                      </div>
                      </>
                    ))
                  }
                 
             </div>
             <div className="h-[50px]  rounded-xl outline-none py-2 ml-auto mr-auto px-2 mt-8 mb-8  text-center flex flex-col text-2xl w-[96%]">
             <Slider onChange={handleChange} className="outline-none" value={sliderValue} />
             </div>
             <div className="h-[70px] rounded-xl py-2 ml-auto mr-auto px-2 mt-5 text-center flex flex-col text-2xl w-[96%]">
             <button onClick={() => frontrun()} className="w-[170px] text-lg ml-auto mr-auto bg-[#ffbb01]/70 h-10   rounded-full">
             Front Run
           </button>
             </div>
           </div>
         </div> : <></>
        }
        
       
        <div className="relative mt-0 flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-yellow-700 before:dark:opacity-10 after:dark:from-[#b99530] after:dark:via-[#ffbb01] after:dark:opacity-20 before:lg:h-[360px] z-[-1]"></div>
      </div>
    
    </div>
  );
};
