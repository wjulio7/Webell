import React,{useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {storage} from '../../firebase/index'
import logoImg from '../../assets/bar.png';
import {FiArrowLeft} from 'react-icons/fi';
import './styles.css';


import api from '../../services/api'

export default function NewProduct() {

    const[nameProd, setnameProd] = useState('')
    const[description, setDescription] = useState('')
    const[value, setValue] = useState('')
    //const [urlImgProd, seturlImgProd] = useState("")

    const [image, setImage] = useState("");

    const usercpf = localStorage.getItem('userCpf')
    const history = useHistory()

    //pega mudanças na imagem selecionada
    const handleChange = e => {
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }
    async function handleNewProduct(e) {
        e.preventDefault()
        const imgProdName = Math.random()+image.name

        const UploadTask = storage.ref(`images/${imgProdName}`).put(image)//put faz o upload
        UploadTask.on("state_changed",
            snapshot => {},//this basicaly indicate the current progress of file upload
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref("images")
                    .child(imgProdName)
                    .getDownloadURL()//the url of thefile that we uploaded to firebase
                    .then(urlImgProd =>{
                        const data = {
                            nameProd,
                            description,
                            value,
                            urlImgProd,
                            imgProdName
                        };
                        api.post('produtoController', data,{
                            headers: {
                                Authorization: usercpf
                            }
                        })
                        history.push('/profile')
                    })
            })
    }
    return(
        <div className="new-incident-container">
            <div className="content">
            <section>
        <img src={logoImg} alt="Barganhar" />
        <h1>Cadastrar novo produto</h1>
        <p>Cadastre aqui um produto que deseje oferecer.</p>

        <Link className="back-link" to="/profile">{/*Chamando o estilo da class back-link*/}
                <FiArrowLeft size={16} color="#E02041"/>
                Voltar para página de cadastro de produtos.
            </Link>
        </section>
            <form onSubmit={handleNewProduct}>
                <input placeholder="Nome do Produto"
                       value={nameProd}
                       onChange={e=> setnameProd(e.target.value)} maxLength="30"/>
                <textarea placeholder="Descrição do Produto"
                       value={description}
                       onChange={e=> setDescription(e.target.value)} maxLength="160"/>
                <input placeholder="Valor"
                       value={value}
                       onChange={e=> setValue(e.target.value)} maxLength="9"/>
                <input  placeholder="Foto" type="file"  accept="image/*"  onChange={handleChange}/>
                <button className="button" type="submit">Cadastrar</button>
            </form>
        </div>
    </div>
    )
}