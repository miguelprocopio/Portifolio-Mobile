import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import Header from '../components/Header'; // Certifique-se que o Header existe

function gerarSenhaAleatoria() {
  const digitos = new Set();
  while (digitos.size < 4) {
    digitos.add(Math.floor(Math.random() * 10));
  }
  return Array.from(digitos).join('');
}

function verificarTentativa(tentativa, senha) {
  let acertos = 0;
  let semiAcertos = 0;

  for (let i = 0; i < 4; i++) {
    if (tentativa[i] === senha[i]) {
      acertos++;
    } else if (senha.includes(tentativa[i])) {
      semiAcertos++;
    }
  }

  return { acertos, semiAcertos };
}

export default function JogoSenha() {
  const [senha, setSenha] = useState('');
  const [tentativa, setTentativa] = useState('');
  const [historico, setHistorico] = useState([]);
  const [jogoAtivo, setJogoAtivo] = useState(false);

  const iniciarJogo = () => {
    const novaSenha = gerarSenhaAleatoria();
    setSenha(novaSenha);
    setTentativa('');
    setHistorico([]);
    setJogoAtivo(true);
    console.log("Nova senha:", novaSenha);
  };

  const handleTentar = () => {
    if (tentativa.length !== 4 || new Set(tentativa).size !== 4) {
      Alert.alert("Erro", "Digite 4 dígitos diferentes.");
      return;
    }

    const resultado = verificarTentativa(tentativa, senha);
    setHistorico([{ tentativa, ...resultado }, ...historico]);
    setTentativa('');

    if (resultado.acertos === 4) {
      Alert.alert("Parabéns!", "Você acertou a senha!");
      setJogoAtivo(false);
    }
  };

  const mostrarSenha = () => {
    Alert.alert("Senha correta", `A senha era: ${senha}`);
    setJogoAtivo(false);
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Jogo Senha (Bulls and Cows)</Text>

      {!jogoAtivo && (
        <Button title="Iniciar Jogo" onPress={iniciarJogo} />
      )}

      {jogoAtivo && (
        <>
          <TextInput
            style={styles.input}
            maxLength={4}
            keyboardType="numeric"
            value={tentativa}
            onChangeText={(text) => setTentativa(text.replace(/\D/g, ''))}
            placeholder="Digite 4 números diferentes"
          />
          <View style={styles.buttonRow}>
            <Button title="Tentar" onPress={handleTentar} />
            <Button title="Desistir" onPress={mostrarSenha} />
          </View>

          <Text style={styles.subtitle}>Tentativas</Text>
          <FlatList
            data={historico}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Text>{item.tentativa} - {item.acertos} Bulls, {item.semiAcertos} Cows</Text>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  input: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
});
