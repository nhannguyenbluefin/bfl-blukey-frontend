import React, {useEffect, useState} from 'react';

import "./TransactionForm.scss"
import Button from "../../Inputs/Button/Button";
import {generateButton} from "../../../services/Generators/generateButton";
import generateInput from "../../../services/Generators/generateInput";
import Post from "../../../services/Api/POST/post";
import Input from "../../Inputs/Input/Input";
import {showSnack} from "../../../redux";
import {needReload} from "../../../redux";
import {useDispatch} from "react-redux";
import Put from "../../../services/Api/PUT/put";

function TransactionForm(props) {
  let dispatch = useDispatch(),
    {transaction, mode} = props.configs,
    {cancel} = props.clickHandler,
    {firstName, lastName} = JSON.parse(localStorage.getItem('user')),
    [agentName, setAgentName] = useState(generateInput('Agent name', 'text', '', 'half', true, [], true)),
    mlsID = generateInput('MLS-ID', 'text', `${transaction?.mlsId || ''}`, 'half', true, [], mode === 'view'),
    apn = generateInput('Apn', 'text', `${transaction?.apn || ''}`, 'half', true, [], mode === 'view'),
    address = generateInput('Address', 'text', `${transaction?.address || ''}`, 'half', true, [], mode === 'view'),
    city = generateInput('City', 'text', `${transaction?.city || ''}`, 'half', true, [], mode === 'view'),
    state = generateInput('State', 'text', `${transaction?.state || ''}`, 'half', true, [], mode === 'view'),
    zipCode = generateInput('Zip code', 'text', `${transaction?.zipCode || ''}`, 'half', true, [], mode === 'view'),
    buyer = generateInput('Buyer', 'text', `${transaction?.buyerName || ''}`, 'half', true, [], mode === 'view'),
    seller = generateInput('Seller', 'text', `${transaction?.sellerName || ''}`, 'half', true, [], mode === 'view'),
    price = generateInput('Price ($)', 'number', `${transaction?.listingPrice || 0}`, 'half', true, [], mode === 'view'),
    commissionRate = generateInput('Commission rate (%)', 'number', `${transaction?.commissionAmount || 0}`, 'half', true, [], mode === 'view'),
    startDate = generateInput('Start date', 'date', `${transaction?.listingStartDate || ''}`, 'half', true, [], mode === 'view'),
    endDate = generateInput('End date', 'date', `${transaction?.listingEndDate || ''}`, 'half', true, [], mode === 'view'),
    createButton = generateButton(`${mode === 'edit' ? 'Save' : 'Create'}`, 'text', 'solid', 'md'),
    cancelButton = generateButton('Cancel', 'text', 'outlined', 'md')


  useEffect(() => {
    if (transaction.firstName && transaction.lastName)
      setAgentName(generateInput('Agent name', 'text', `${transaction.firstName} ${transaction.lastName}`, 'half', true, [], true))
    else
      setAgentName(generateInput('Agent name', 'text', `${firstName} ${lastName}`, 'half', true, [], true))
  }, [])

  let validate = () => {
    let inputs = [agentName, address, mlsID, seller, buyer, price, commissionRate, startDate, endDate]
    if (inputs.some(i => i.getIsValid === false))
      return console.log(false)

    if (startDate.getValue > endDate.getValue)
      return dispatch(showSnack('Start-date must before/same End date', 'danger'))

    let payload = {
      address: address.getValue,
      city: city.getValue,
      state: state.getValue,
      zipCode: zipCode.getValue,
      mlsId: mlsID.getValue,
      apn: apn.getValue,
      listingPrice: price.getValue,
      commissionAmount: commissionRate.getValue,
      sellerName: seller.getValue,
      buyerName: buyer.getValue,
      listingStartDate: startDate.getValue,
      listingEndDate: endDate.getValue,
    }

    if (mode === 'create')
      return create(payload)
    return save(payload)
  }
  let create = async (payload) => {
    await Post('transactions', payload)
    closeForm()
  }
  let save = async (payload) => {
    await Put('transactions', transaction.id, payload)
    closeForm()
  }
  let closeForm = () => {
    cancel('Transactions')
    dispatch(needReload())
  }


  return (
    <div className='transaction-form-container'>
      <div className="blocks">
        <div className="transaction-information-area">
          <p className="title">TRANSACTION INFORMATION</p>

          <div className="block">
            <Input configs={agentName}/>
            <Input configs={mlsID}/>
            <Input configs={apn}/>
          </div>

          <div className="block">
            <Input configs={address}/>
            <Input configs={city}/>
            <Input configs={state}/>
            <Input configs={zipCode}/>
          </div>

          <div className="block">
            <Input configs={seller}/>
            <Input configs={buyer}/>
            <Input configs={price}/>
            <Input configs={commissionRate}/>
            <Input configs={startDate}/>
            <Input configs={endDate}/>
          </div>
        </div>

        {
          mode !== "view" &&
          <div className="button-area">
            <Button configs={createButton} clickHandler={validate}/>
            <Button configs={cancelButton} clickHandler={() => cancel('Transactions')}/>
          </div>
        }
      </div>
    </div>
  );
}

export default TransactionForm;