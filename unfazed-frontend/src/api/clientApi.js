import axios from 'axios';

const API_URL = '/api/clients';

export const getClients = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getClientById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await axios.post(API_URL, clientData);
  return response.data;
};

export const updateClient = async (id, clientData) => {
  const response = await axios.put(`${API_URL}/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const getClientIntake = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/intake`);
  return response.data;
};

export const updateClientIntake = async (id, intakeData) => {
  const response = await axios.put(`${API_URL}/${id}/intake`, intakeData);
  return response.data;
};

export const getClientConsent = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/consent`);
  return response.data;
};

export const createClientConsent = async (id, consentData) => {
  const response = await axios.post(`${API_URL}/${id}/consent`, consentData);
  return response.data;
};
