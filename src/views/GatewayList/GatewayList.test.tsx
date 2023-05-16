import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GatewayList from './GatewayList';
import GatewayService from '../../service/GatewayService';
import '@testing-library/jest-dom/extend-expect'

describe('GatewayList', () => {
  const mockGateways = [
    {
      serial_number: '12345',
      name: 'Gateway 1',
      ip_address: '192.168.0.1',
      devices: []
    },
    {
      serial_number: '67890',
      name: 'Gateway 2',
      ip_address: '192.168.0.2',
      devices: []
    }
  ];

  let getAllGatewaysSpy: jest.SpyInstance;
  let addGatewaySpy: jest.SpyInstance;
  let removeGatewaySpy: jest.SpyInstance;

  beforeEach(() => {
    getAllGatewaysSpy = jest.spyOn(GatewayService.prototype, 'getAllGateways').mockResolvedValue(mockGateways);
    addGatewaySpy = jest.spyOn(GatewayService.prototype, 'addGateway').mockResolvedValue(true);
    removeGatewaySpy = jest.spyOn(GatewayService.prototype, 'removeGateway').mockResolvedValue(true);
  });

  afterEach(() => {
    getAllGatewaysSpy.mockRestore();
    addGatewaySpy.mockRestore();
    removeGatewaySpy.mockRestore();
  });

  it('should render a table with the correct columns', async () => {
    render(<GatewayList />, { wrapper: MemoryRouter });
    const serialNumberHeader = await screen.findByText('Serial Number');
    const nameHeader = screen.getByText('Name');
    const ipAddressHeader = screen.getByText('IP Address');
    const devicesHeader = screen.getByText('Devices');
    const actionsHeader = screen.getByText('Actions');
    expect(serialNumberHeader).toBeInTheDocument();
    expect(nameHeader).toBeInTheDocument();
    expect(ipAddressHeader).toBeInTheDocument();
    expect(devicesHeader).toBeInTheDocument();
    expect(actionsHeader).toBeInTheDocument();
  });

  it('should render a row for each gateway', async () => {
    render(<GatewayList />, { wrapper: MemoryRouter });
    const serialNumberCells = await screen.findAllByText(/12345|67890/);
    const nameCells = screen.getAllByText(/Gateway 1|Gateway 2/);
    const ipAddressCells = screen.getAllByText(/192.168.0.1|192.168.0.2/);
    expect(serialNumberCells).toHaveLength(2);
    expect(nameCells).toHaveLength(2);
    expect(ipAddressCells).toHaveLength(2);
  });

  it('should open the GatewayDialog when the Add New Gateway button is clicked', async () => {
    render(<GatewayList />, { wrapper: MemoryRouter });
    const addButton = await screen.findByTestId('add-gateway');
    fireEvent.click(addButton);
    const dialogTitle = await screen.findByText('Add Gateway');
    expect(dialogTitle).toBeInTheDocument();
  });

  it('should add a new gateway to the table when the Add button is clicked in the GatewayDialog', async () => {
    render(<GatewayList />, { wrapper: MemoryRouter });
    const addButton = await screen.findByTestId('add-gateway'); 
    fireEvent.click(addButton);

    const serialNumberInput = screen.getByLabelText(/Serial Number/);
    const nameInput = screen.getByLabelText(/Name/);
    const ipAddressInput = screen.getByLabelText(/IP Address/);
    const addButtonInDialog = await screen.findByTestId('save-gateway');
    fireEvent.change(serialNumberInput, { target: { value: '54321' } });
    fireEvent.change(nameInput, { target: { value: 'Gateway 3' } });
    fireEvent.change(ipAddressInput, { target: { value: '192.168.0.3' } });
    fireEvent.click(addButtonInDialog);
    await waitFor(() => {
      const serialNumberCells = screen.getAllByText(/12345|67890|54321/);
      expect(serialNumberCells).toHaveLength(3);
    });
  });

  it('should not to add a new gateway to the table when serial number value is added before', async () => {
    render(<GatewayList />, { wrapper: MemoryRouter });
    const addButton = await screen.findByTestId('add-gateway'); 
    fireEvent.click(addButton);

    const serialNumberInput = screen.getByLabelText(/Serial Number/);
    const nameInput = screen.getByLabelText(/Name/);
    const ipAddressInput = screen.getByLabelText(/IP Address/);
    const addButtonInDialog = await screen.findByTestId('save-gateway');
    fireEvent.change(serialNumberInput, { target: { value: '12345' } });
    fireEvent.change(nameInput, { target: { value: 'Gateway 3' } });
    fireEvent.change(ipAddressInput, { target: { value: '192.168.0.3' } });
    expect(addButtonInDialog).toBeDisabled()
  });

  it('should remove a gateway from the table when the Delete button is clicked', async () => {
    render(<GatewayList />, { wrapper: MemoryRouter });
    const deleteButton = await screen.findAllByTestId('delete-gateway');
    fireEvent.click(deleteButton[0]);
    await waitFor(async() => {
      const rowsArray = await screen.findAllByTestId('row-gateway');
      expect(rowsArray).toHaveLength(1);
    });
  });
});