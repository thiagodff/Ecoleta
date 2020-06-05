import React, { useState, useEffect } from 'react';
import { View, Platform, KeyboardAvoidingView, TextInput, Alert, ImageBackground,Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (!uf) {
      return;
    }

    axios
    .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos?orderBy=nome`)
    .then(response => {
      const cityNames = response.data.map(city => city.nome);
      // remove duplicated city
      const filteredCityNames = cityNames.filter((city, index) => cityNames.indexOf(city) === index);

      setCities(filteredCityNames);
    });
  }, [uf]);

  function handleNavigateToPoints() {
    if (!uf || !city) {
      Alert.alert('Falha na busca', 'Você precisa selecionar uma UF e uma cidade');
      return;
    }

    navigation.navigate('Points', {
      uf,
      city,
    });
  }
  
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
        // resizeMode="contain"
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{ label: 'Selecione a UF' }}
            style={{ inputAndroid: styles.picker }}
            onValueChange={value => setUf(value)}
            useNativeAndroidPickerStyle={false}
            items={ufs.map(item => {
              return {
                label: item,
                value: item,
              }
            })}
          />

          <RNPickerSelect
            placeholder={{ label: 'Selecione a cidade' }}
            style={{ inputAndroid: styles.picker }}
            onValueChange={value => setCity(value)}
            useNativeAndroidPickerStyle={false}
            items={cities.map(item => {
              return {
                label: item,
                value: item,
              }
            })}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            value={uf}
            onChangeText={setUf}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite a cidade"
            autoCorrect={false}
            value={city}
            onChangeText={setCity}
          /> */}

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  picker: {
    height: 60,
    backgroundColor: '#FFF',
    color: '#666',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    color: '#666',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});