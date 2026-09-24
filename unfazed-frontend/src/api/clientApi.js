import api from './axios';

const API_URL = '/clients';

const unwrap = (response) => response.data;

export const getClients = async () => unwrap(await api.get(API_URL));

export const getClientById = async (id) => unwrap(await api.get(`${API_URL}/${id}`));

export const createClient = async (clientData) => unwrap(await api.post(API_URL, clientData));

export const updateClient = async (id, clientData) => unwrap(await api.patch(`${API_URL}/${id}`, clientData));

export const deleteClient = async (id) => unwrap(await api.delete(`${API_URL}/${id}`));

export const getClientIntake = async (id) => unwrap(await api.get(`${API_URL}/${id}/intake`));

export const updateClientIntake = async (id, intakeData) => unwrap(await api.put(`${API_URL}/${id}/intake`, intakeData));

export const getClientConsent = async (id) => unwrap(await api.get(`${API_URL}/${id}/consent`));

export const createClientConsent = async (id, consentData) => unwrap(await api.post(`${API_URL}/${id}/consent`, consentData));
