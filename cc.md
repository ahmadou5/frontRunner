import React, { useState, useEffect } from 'react'
import { HomeIcon, PencilIcon, BuildingLibraryIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { 
  Typography,
  Card,
  CardBody,
  Input,
  Slider,
  Button,
  Spinner,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel, 
  slider
} from "@material-tailwind/react";

import { v4 as uuidv4 } from 'uuid';
import Connect from './Connect';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { formatAddress } from '../util/format-data';

import 'react-toastify/dist/ReactToastify.css';

import '../custom-toast.css';

export default function Indexer() {
  const wallet = useSelector(state => state.wallet);
  const [transactionId, setTransactionId] = useState("");
  const [feeRate, setFeeRate] = useState(20);
  const [sliderValue, setSliderValue] = useState(4);
  const [loading, setLoading] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [fees, setFees] = useState({});
  const [ins, setIns] = useState([]);
  const [outs, setOuts] = useState([]);

  const handleChange = (event) => {
    setSliderValue(event.target.value);
    setFeeRate(Math.round(event.target.value * 5));
  }

  const handleSubmit = async () => {
    if (wallet.nostrPaymentAddress == '')
    {
      toast('Please connect wallet first!' , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
        });
      return;
    }
    if (transactionId == '')
    {
      toast('Please insert transactionid!' , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
        });
      return;
    }
    
    setLoading(true);
    await frontrun();
    
  }

  const frontrun = async () => {
    const url = 'https://api.brc500.com/frontrun';
    const data = {
      transactionId: transactionId,
      address: wallet.nostrPaymentAddress,
      feeRate: Number(feeRate),
      provider: wallet.domain,
      pubkey: wallet.ordinalsPublicKey
    };

    let response  = await fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    response = await response.json();
    if (response.status == "success"){
      try{
        if (wallet.domain == "unisat")
        {
          let res = await window.unisat.signPsbt(response.psbt);
          // let res1 = "70736274ff0100df0200000001952ce4b725288156ac0730336864ff89ab31d6ed6c72431ff85f21c668156d210100000000fdffffff040714000000000000225120d29c4ea373e66610f952ef4f2c53b72ebd2a4645092bec58ba59140e2ae7fe3da0080000000000002251209b57783ff38333b575f35634ba9795d28dddbe75b0e5fd582974df3b4f0fc37c68100000000000002251200c01e401e1eb5116b0cf41dad123dbc53d70bdb27167b886e86448197f7519367635010000000000225120f28491908b5bb68fe21890d9fb1247103bc53f89964aec64c2fb55a45f570f7a000000000001012b5180010000000000225120f28491908b5bb68fe21890d9fb1247103bc53f89964aec64c2fb55a45f570f7a01030401000000011720e1289efba4a8c5651a079dfc31d405bb7e3406a038706883a85d7e2e326341e40000000000";
          // let res = await window.unisat.signPsbt(res1);
          res = await window.unisat.pushPsbt(res);
          //showInfoMessage(`Order successfully published! ${res}`);
        }
        if (wallet.domain == "okxwallet")
        {
          let res = await window.okxwallet.bitcoin.signPsbt(response.psbt);
          res = await window.okxwallet.bitcoin.pushPsbt(res);  
        }
      }
      catch(e)
      {
        console.log(e);
      }
    }
    else
    {
      toast(response.message , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
        });
    }
    setLoading(false);
  }

  const handleShowTransactionData = async () => {
    try {
      let response = await fetch(`https://mempool.space/api/tx/${transactionId}`);
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
          value: element.prevout.value});
      })
      data.vout.forEach((element) => {
        outputs.push({
          address: element.scriptpubkey_address,
          value: element.value});
      })

      setIns(inputs);
      setOuts(outputs);

      setFees({
        satsFee: satsFee,
        serviceFee: serviceFee,
        royalty: royalty,
        networkFee: networkFee,
        feeRate: feeRate
      })
      setShowTransaction(true);
    } catch (e) {
      toast("Please insert correct transaction id!" , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: 'error-toast'
        });
      setShowTransaction(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 md:p-10 p-5 bg-[#F0F0F0] min-h-[100vh] items-center w-full">
      <Typography variant="h1" color = "blue-gray">Frontrun</Typography>
      <div className="flex flex-row gap-2 w-full justify-end items-center ">
        <Connect />
      </div>
      <div className="flex flex-row justify-center mt-4 items-center max-w-[800px] md:w-[800px] w-full p-2">
        <Card className="w-full">
          <CardBody>
            <div className="flex md:flex-row flex-col items-end gap-3">
              <Input label="TransactionId" value = {transactionId} onChange = {(e) => {setTransactionId(e.target.value)}}/>
              <Button className="w-[200px]" onClick = {handleShowTransactionData}>Retrive Tx Data</Button> 
            </div>
            {
              showTransaction ?
                <div className="flex flex-col gap-2 mt-5">
                  <div className="flex flex-row items-center justify-between">
                    <div className="text-[20px] font-bold">Transaction Data</div>
                    <div className="flex flex-row gap-[2px] items-center justify-end mt-4">
                      <span className="font-bold text-[24px]">{feeRate}</span>
                      <span>sats/vB</span>
                    </div>
                  </div>
                  <div className="flex flex-col mb-3 gap-3 items-center max-h-[400px] overflow-scroll">
                    <div className="text-[18px] font-bold">Inputs data</div>
                    {
                      ins.map((element) => {
                        return (<div key={uuidv4()} className="flex flex-row font-semibold justify-between w-[300px]">
                                  <div>{formatAddress(element.address)}</div>
                                  <div>{element.value} sats</div>
                                </div>)
                      })
                    }
                    <div className="text-[18px] font-bold">Outputs data</div>
                    {
                      outs.map((element) => {
                        return (<div key={uuidv4()} className="flex flex-row font-semibold justify-between w-[300px]">
                                  <div>{formatAddress(element.address)}</div>
                                  <div>{element.value} sats</div>
                                </div>)
                      })
                    }
                  </div>
                  {/* <div className="flex flex-col gap-2 font-semibold items-center">
                    <div className="flex flex-row justify-between w-[300px]">
                      <div>Inscription Fee</div>
                      <div>{fees.satsFee} sats</div>
                    </div>
                    <div className="flex flex-row justify-between w-[300px]">
                      <div>Service Fee</div>
                      <div>{fees.serviceFee} sats</div>
                    </div>
                    <div className="flex flex-row justify-between w-[300px]">
                      <div>Royalty</div>
                      <div>{fees.royalty} sats</div>
                    </div>
                    <div className="flex flex-row justify-between w-[300px]">
                      <div>Network Fee</div>
                      <div>{fees.networkFee} sats</div>
                    </div>
                    <div className="flex flex-row justify-between w-[300px]">
                      <div>FeeRate</div>
                      <div>{fees.feeRate} sats/vB</div>
                    </div>
                  </div>
                  <div className="w-full flex flex-row gap-[2px] items-center justify-end mt-4">
                    <span className="font-bold text-[24px]">{feeRate}</span>
                    <span>sats/vB</span>
                  </div> */}
                  <Slider 
                    className="mt-1"
                    value = {sliderValue}
                    onChange = {handleChange}
                  />
                  {
                    loading ? 
                      <div className="flex flex-row w-full justify-center mt-8">
                        <Spinner className="h-12 w-12" />
                      </div>
                      :
                      <div className="flex flex-row w-full justify-center gap-5 mt-8">
                        <Button onClick = {() => {handleSubmit()}} className="px-10">Update Psbt</Button>
                      </div>
                  }
                </div>
                :<></>
            }
            
          </CardBody>
        </Card>
      </div>
      <ToastContainer />
    </div>
  )
}
