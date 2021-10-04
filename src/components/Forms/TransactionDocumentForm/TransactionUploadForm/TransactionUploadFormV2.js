import React, {useEffect, useState} from 'react';

import "./TransactionUploadFormV2.scss"
import gInput from "../../../../services/Generators/gInput";
import Input from "../../../Inputs/Input/Input";
import Button from "../../../Inputs/Button/Button";
import {gButton} from "../../../../services/Generators/gButton";
import {useDispatch} from "react-redux";
import {hideSnack, showSnack} from "../../../../redux";
import Post from "../../../../services/Api/POST/post";
import Delete from "../../../../services/Api/DELETE/delete";

function TransactionUploadFormV2(props) {
  let dispatch = useDispatch(),
      {transaction, mode, type, documents} = props.configs,
      {updateCanComplete, userEdited, loadDocuments} = props.clickHandler,
      [uploadedDocuments, setUploadedDocuments] = useState([]),
      [restDocuments, setRestDocuments] = useState([]),
      [typeInput, setTypeInput] = useState(gInput(`Type`, 'text', '', 'full', true, [])),
      [documentInput, setDocumentInput] = useState(gInput('Document', 'file', '', 'full', true)),
      submitButton = gButton('Submit', 'text', 'solid', 'h-full w-fit'),
      removeButton = gButton('close', 'icon', 'secondary', 'md', 'close-icon'),
			[hidden, setHidden] = useState({
				listing: false,
				buying: false
			})


  useEffect(() => {
    setTypeInput(gInput(`Type`, 'text', '', 'full', true, restDocuments.map(i => i.documentTypeName)))
  }, [restDocuments])

  useEffect(() => {
    if (documents.uploaded && documents.rest) {
      setUploadedDocuments(documents.uploaded)
      setRestDocuments(documents.rest)
    }
  }, [documents])

  let validate = () => {
    console.log('File validation')

    if (!documentInput.getValue) return console.log('Ignore')

    if (!typeInput.isValid)
      return dispatch(showSnack('Invalid type', 'danger'))

    let documentType = restDocuments.find(i => i.documentTypeName === typeInput.getValue)

    if (!/\.pdf$/.test(documentInput.getValue.name))
			return dispatch(showSnack('Document should be PDF file', 'danger'))
		else
			dispatch(hideSnack())

    upload(documentType)
  }

  let upload = async (documentType) => {
    console.log('Upload document')
    let formData = new FormData(),
        params = {
          transactionId: transaction.id,
          documentTypeId: documentType.id || documentType.documentTypeId
        }

    formData.append('pdf', documentInput.getValue)
		let {data} = await Post('uploadTransactionDocumentType', formData, false, params)
    if (data.file) {
      loadDocuments()
      checkCanComplete(false, data.canComplete)
      userEdited()
    }
  }
  let remove = async (file) => {
    let payload = {
      transactionId: transaction.id,
      documentTypeId: file.id || file.documentTypeId
    }

    let {data} = await Delete('uploadTransactionDocumentType','', payload)
    if (data.file) {
      loadDocuments()
      checkCanComplete(true, data.canComplete)
      userEdited()
    }
  }
  let checkCanComplete = (preCanComplete, postCanComplete) => {
    // upload: false -> true
    // remove: true -> false
    if (preCanComplete !== postCanComplete)
      updateCanComplete(postCanComplete)
  }
	let hideCategory = (category) => {
		console.log(hidden, category)
		setHidden(prevState => {
			return {
				...prevState,
				[category]: !prevState[category]
			}

		})
	}

  return (
		<div className={`transaction-upload-form`}>
			<div className="transaction-upload-form__scroll">
				{
					mode === 'edit' &&
					<div className="transaction-upload-form__scroll__upload-area">
						<Input configs={typeInput} />
						<Input configs={documentInput} fileHandler={() => { }} />
						<Button configs={submitButton} clickHandler={validate} />
					</div>
				}


				{
					Object.keys(uploadedDocuments).map(group => {
						return (
							<div
								key={group}
								className="transaction-upload-form__scroll__uploaded-area"
							>
								<p 
									className="transaction-upload-form__scroll__uploaded-area__title"
									onClick={() => hideCategory(group)}
									>
									{group.toUpperCase()} ({uploadedDocuments[group].length})
								</p>

								<div
									className={`transaction-upload-form__scroll__uploaded-area__uploaded ${hidden[group] ? 'hidden' : ''}`}
								>
									{
										uploadedDocuments[group].length === 0
											? (<span>Documents uploaded will be here... </span>)
											: uploadedDocuments[group].map(i => {
												return (
													<div
														key={Math.random()}
														className="transaction-upload-form__scroll__uploaded-area__uploaded__document"
														title={i.fileName}
													>
														<a
															href={i.url}
															target="_blank"
															rel="noreferrer"
														>
															{i.documentTypeName}
														</a>

														{
															mode === 'edit' &&
															<div className="button-area">
																<Button
																	configs={removeButton}
																	clickHandler={() => remove(i)}
																/>
															</div>
														}
													</div>
												)
											})
									}
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
  );
}

export default TransactionUploadFormV2;