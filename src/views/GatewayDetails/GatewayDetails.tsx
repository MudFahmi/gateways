
import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Chip, Alert, AlertTitle, Collapse } from "@mui/material";
import { Gateway, Device } from "../../@types";
import GatewayService from "../../service/GatewayService";
import DeviceDialog from "../../components/DeviceDialog";
import { useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const MAXIMUM_NUM_OF_DEVICES = 10

const mapStatusColor: Record<Device['status'], "success" | "error"> = {
    online: 'success',
    offline: 'error'
}

const GatewayDetails = () => {
    const service = useMemo(() => new GatewayService(), [])
    const params = useParams();
    const serialNumberParam = params.serialNumber as string;
    const [gateway, setGateway] = useState<Gateway>();
    const [error, setError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const canAddDevcie = useMemo(() => (gateway?.devices?.length || 0) < MAXIMUM_NUM_OF_DEVICES, [gateway])
    const fetchGateway = useCallback(async () => {
        const data = await service.getGateway(serialNumberParam);
        if (!data) {
            setError(true)
        }
        setGateway(data);
    }, [serialNumberParam, service])

    useEffect(() => {
        fetchGateway();
    }, [fetchGateway]);

    const handleAddDevice = async (device: Device) => {
        await service.addDevice(gateway!.serial_number, device);
        setGateway({ ...gateway!, devices: [...gateway!.devices, device] });
    }

    const handleRemoveDevice = async (uid: number) => {
        await service.removeDevice(gateway!.serial_number, uid);
        setGateway({ ...gateway!, devices: gateway!.devices.filter((d) => d.uid !== uid) });
    }

    if (error) {
        return (
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                This Serial Number is not registered yet — <strong>check it out!</strong>
            </Alert>
        )
    }

    return (
        <>
            <h2>{gateway?.name}</h2>
            <p>Serial Number: {gateway?.serial_number}</p>
            <p>IP Address: {gateway?.ip_address}</p>

            <Button
                data-testid="add-device"
                variant="outlined"
                color="primary"
                disabled={!canAddDevcie}
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{ float: 'right', mb: 2 }}
            >
                Add New Device
            </Button>

            <Collapse in={!canAddDevcie}>
                <Alert
                    variant="outlined"
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    You already have the maximum number of devices — <strong>{MAXIMUM_NUM_OF_DEVICES} Devices</strong>
                </Alert>
            </Collapse>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow data-testid="columns-device">
                            <TableCell>UID</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Date Created</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gateway?.devices?.map((device) => (
                            <TableRow key={device.uid} data-testid="row-device">
                                <TableCell>{device.uid}</TableCell>
                                <TableCell>{device.vendor}</TableCell>
                                <TableCell>{device.date_created.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip label={device.status} color={mapStatusColor[device.status]} variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        data-testid="delete-device"
                                        color="error"
                                        onClick={() => handleRemoveDevice(device.uid)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DeviceDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAddDevice={handleAddDevice} />
        </>
    );
}

export default GatewayDetails;