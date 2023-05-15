import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GatewayDetails from './GatewayDetails';
import GatewayService from '../../service/GatewayService';
import '@testing-library/jest-dom/extend-expect';
import { Gateway } from '../../@types';

describe('GatewayDetails', () => {
    const mockGateway: Gateway = {
        serial_number: '12345',
        name: 'Gateway 1',
        ip_address: '192.168.0.1',
        devices: [
            {
                uid: 101,
                vendor: 'Device Vendor 1',
                date_created: new Date('2022-05-01T00:00:00'),
                status: 'online',
            },
        ],
    };

    let getGatewaySpy: jest.SpyInstance;
    let addDeviceSpy: jest.SpyInstance;
    let removeDeviceSpy: jest.SpyInstance;

    beforeEach(() => {
        getGatewaySpy = jest.spyOn(GatewayService.prototype, 'getGateway').mockResolvedValue(mockGateway);
        addDeviceSpy = jest.spyOn(GatewayService.prototype, 'addDevice').mockResolvedValue(true);
        removeDeviceSpy = jest.spyOn(GatewayService.prototype, 'removeDevice').mockResolvedValue(true);
    });

    afterEach(() => {
        getGatewaySpy.mockRestore();
        addDeviceSpy.mockRestore();
        removeDeviceSpy.mockRestore();
    });

    it('should render gateway details and devices table', async () => {
        render(
            <MemoryRouter initialEntries={['/gateway/12345']}>
                <Routes>
                    <Route path="/gateway/:serialNumber" Component={GatewayDetails} />
                </Routes>
            </MemoryRouter>
        );
        const tableHeaders = await screen.findByTestId('columns-device');
        const name = await screen.findByText('Gateway 1');

        expect(tableHeaders).toBeInTheDocument();
        expect(name).toBeInTheDocument();
    });

    it('should open the Device Dialog when the Add New Device button is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/gateway/12345']}>
                <Routes>
                    <Route path="/gateway/:serialNumber" Component={GatewayDetails} />
                </Routes>
            </MemoryRouter>
        );

        const addButton = await screen.findByTestId('add-device');
        fireEvent.click(addButton);
        const dialogAction = await screen.findByText('Add Device');

        expect(dialogAction).toBeInTheDocument();
    });

    it('should add a new device to the table when the Add button is clicked in the DeviceDialog', async () => {
        render(
            <MemoryRouter initialEntries={['/gateway/12345']}>
                <Routes>
                    <Route path="/gateway/:serialNumber" Component={GatewayDetails} />
                </Routes>
            </MemoryRouter>
        );

        const addButton = await screen.findByTestId('add-device');
        fireEvent.click(addButton);

        const vendorInput = screen.getByLabelText(/Vendor/);
        const statusSelect = screen.getByLabelText(/Status/);
        const addButtonInDialog = screen.getByText('Add Device');
        fireEvent.change(vendorInput, { target: { value: 'Device Vendor 2' } });
        fireEvent.change(statusSelect, { target: { selectedIndex: 1 } });
        fireEvent.click(addButtonInDialog);

        await waitFor(async () => {
            const rowsArray = await screen.findAllByTestId('row-device');
            expect(rowsArray).toHaveLength(2);
        });
    });

    it('should remove a device from the table when the Delete button is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/gateway/12345']}>
                <Routes>
                    <Route path="/gateway/:serialNumber" Component={GatewayDetails} />
                </Routes>
            </MemoryRouter>
        );

        const deleteButton = await screen.findAllByTestId('delete-device');
        fireEvent.click(deleteButton[0]);
        await waitFor(async () => {
            const rowsArray = await screen.findAllByTestId('row-device');
            expect(rowsArray).toHaveLength(1);
        });
    })
});



