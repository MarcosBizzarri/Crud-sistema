import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/conexao';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import styles from './Tabela.module.css';

const Tabela = () => {
  const [dados, setDados] = useState([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [emailOuCelular, setEmailOuCelular] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [erroContato, setErroContato] = useState('');
  const [itemExcluir, setItemExcluir] = useState(null); // Estado para o item a ser excluído

  useEffect(() => {
    const BuscarDados = async () => {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const dadosFirestore = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDados(dadosFirestore);
    };
    BuscarDados();
  }, []);

  const validarEmailOuCelular = (valor) => {
    const regexEmail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    const regexCelular = /^\d{10,11}$/;
    return regexEmail.test(valor) || regexCelular.test(valor);
  };

  const adicionarItem = async () => {
    if (!nome || !idade || !emailOuCelular) {
      setErroContato('Por favor, preencha todos os campos.');
      return;
    }
    if (!validarEmailOuCelular(emailOuCelular)) {
      setErroContato('Por favor, insira um e-mail ou número de celular válido.');
      return;
    }
    const novoItem = { nome, idade: parseInt(idade), contato: emailOuCelular };
    try {
      const docRef = await addDoc(collection(db, 'usuarios'), novoItem);
      setDados([...dados, { id: docRef.id, ...novoItem }]);
      limparCampos();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const selecionarItemParaEditar = (item) => {
    setEditandoId(item.id);
    setNome(item.nome);
    setIdade(item.idade);
    setEmailOuCelular(item.contato);
  };

  const salvarEdicao = async () => {
    if (!editandoId) return;
    try {
      const itemRef = doc(db, 'usuarios', editandoId);
      await updateDoc(itemRef, { nome, idade: parseInt(idade), contato: emailOuCelular });
      setDados(
        dados.map((item) =>
          item.id === editandoId ? { ...item, nome, idade: parseInt(idade), contato: emailOuCelular } : item
        )
      );
      limparCampos();
      setEditandoId(null);
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
    }
  };

  const confirmarExclusao = (id) => {
    setItemExcluir(id); // Define o item a ser excluído
  };

  const excluirItem = async () => {
    try {
      await deleteDoc(doc(db, 'usuarios', itemExcluir));
      setDados(dados.filter((item) => item.id !== itemExcluir));
      setItemExcluir(null); // Limpa o item a ser excluído após a confirmação
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  const cancelarExclusao = () => {
    setItemExcluir(null); // Cancela a exclusão
  };

  const limparCampos = () => {
    setNome('');
    setIdade('');
    setEmailOuCelular('');
    setErroContato('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Sistema de cadastrar, editar e remover</h2>

      <div className={styles.formContainer}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={styles.input}
        />
        <input
          type="number"
          placeholder="Idade"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="E-mail ou Celular"
          value={emailOuCelular}
          onChange={(e) => setEmailOuCelular(e.target.value)}
          className={styles.input}
        />
        <button onClick={editandoId ? salvarEdicao : adicionarItem} className={styles.button}>
          {editandoId ? 'Salvar' : 'Cadastrar'}
        </button>
        {erroContato && <p className={styles.erro}>{erroContato}</p>}
      </div>

      <div className={styles.cardContainer}>
        {dados.map((item) => (
          <div key={item.id} className={styles.card}>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Nome:</strong> {item.nome}</p>
            <p><strong>Idade:</strong> {item.idade}</p>
            <p><strong>Contato:</strong> {item.contato}</p>
            <button
              className={`${styles.button} ${styles.editButton}`}
              onClick={() => selecionarItemParaEditar(item)}
            >
              Editar
            </button>
            <button
              className={`${styles.button} ${styles.deleteButton}`}
              onClick={() => confirmarExclusao(item.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      {itemExcluir && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Você realmente deseja excluir este item?</p>
            <button className={styles.confirmarButton} onClick={excluirItem}>Sim</button>
            <button className={styles.cancelarButton} onClick={cancelarExclusao}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tabela;
