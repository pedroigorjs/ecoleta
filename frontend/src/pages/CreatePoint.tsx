import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import api from '../services/api';
import CollectItem from './CreatePoint/CollectItem';

import { Container, Field, FieldGroup, ItemsGrid } from './CreatePoint/styles';

import logo from '../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface City {
  id: number;
  nome: string;
}

interface UF {
  id: number;
  nome: string;
  sigla: string;
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [UFs, setUFs] = useState<UF[]>([]);
  const [selectedUF, setSelectedUF] = useState('0');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  });

  useEffect(() => {
    async function getItems() {
      const { data } = await api.get('items');

      setItems(data);
    }

    getItems();
  }, []);

  useEffect(() => {
    async function getUFs() {
      const { data } = await Axios.get(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      );

      setUFs(data);
    }

    getUFs();
  }, []);

  function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
    const UF: string = event.target.value;

    setSelectedUF(UF);
  }

  useEffect(() => {
    async function getCities() {
      const { data } = await Axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`,
      );

      setCities(data);
    }

    getCities();
  }, [selectedUF]);

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city: string = event.target.value;

    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setSelectedPosition([lat, lng]);
  }

  function handleInputValue(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSelectedItem(id: number) {
    const alredySelected = selectedItems.findIndex(item => item === id);

    if (alredySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const city = cities.find(item => item.id === Number(selectedCity))?.nome;
    const uf = UFs.find(item => item.id === Number(selectedUF))?.sigla;
    const [latitude, longitude] = selectedPosition;

    try {
      await api.post('points', {
        name,
        email,
        whatsapp,
        city,
        uf,
        latitude,
        longitude,
        items: selectedItems,
      });

      history.push('/');
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Container>
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft color="#34cb79" size={24} />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do
          <br /> ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <Field>
            <label htmlFor="name">
              Nome da entidade
              <input
                type="text"
                name="name"
                id="name"
                required
                onChange={handleInputValue}
              />
            </label>
          </Field>

          <FieldGroup>
            <Field>
              <label htmlFor="email">
                E-mail
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  onChange={handleInputValue}
                />
              </label>
            </Field>
            <Field>
              <label htmlFor="whatsapp">
                Whatsapp
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  required
                  onChange={handleInputValue}
                />
              </label>
            </Field>
          </FieldGroup>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <FieldGroup>
            <Field>
              <label htmlFor="uf">
                Estado (UF)
                <select
                  name="uf"
                  id="uf"
                  value={selectedUF}
                  required
                  onChange={handleSelectedUF}
                >
                  <option value="0">Selecione uma UF</option>
                  {UFs.map(uf => (
                    <option key={uf.id} value={uf.id}>
                      {uf.nome}
                    </option>
                  ))}
                </select>
              </label>
            </Field>
            <Field>
              <label htmlFor="city">
                Cidade
                <select
                  name="city"
                  id="city"
                  value={selectedCity}
                  required
                  onChange={handleSelectedCity}
                >
                  <option value="0">Selecione uma cidade</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.nome}
                    </option>
                  ))}
                </select>
              </label>
            </Field>
          </FieldGroup>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ItemsGrid>
            {items.map(item => (
              <CollectItem
                key={item.id}
                data={item}
                handleSelectedItem={handleSelectedItem}
              />
            ))}
          </ItemsGrid>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </Container>
  );
};

export default CreatePoint;
