import React, { useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  // useCallback -> toda vez que um estado do array de dependencias for alterado
  // a funcao e recriada na memoria do React (memoriza a funcao)
  // por padrao qualquer alteracao no estado reacria todas as funcoes
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept='image/*'/>
      {
        selectedFileUrl ?
        <img src={selectedFileUrl} alt="imagem do estabelecimento"/>
        : (
          isDragActive ?
          <p><FiUpload />Solte o arquivo aqui ...</p> :
          <p><FiUpload />Imagem do estabelecimento</p>
        )
      }

    </div>
  )
}

export default Dropzone;
