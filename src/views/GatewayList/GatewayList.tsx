import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import GatewayDialog from '../../components/GatewayDialog';
import { Gateway } from "../../@types";
import GatewayService from "../../service/GatewayService";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const GatewayList = () => {
  const service = useMemo(() => new GatewayService(), [])
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchGateways = useCallback(async () => {
    const data = await service.getAllGateways();
    setGateways(data);
  }, [service])
  useEffect(() => {
    fetchGateways();
  }, [fetchGateways]);

  const handleAddGateway = async (gateway: Gateway) => {
    await service.addGateway(gateway)
    setGateways(oldGetways => [...oldGetways, gateway]);
  }

  const handleRemoveGateway = async (serial_number: string) => {
    await service.removeGateway(serial_number);
    setGateways(oldGetways => [...oldGetways.filter(gateway => gateway.serial_number !== serial_number)]);
  }

  const isUniqueSerialNumber = (serial_number: string) => !gateways.find(gateway => gateway.serial_number === serial_number)
  return (
    <>
      <Grid container justifyContent="space-between" marginBottom={2}>
        <Grid>
          <Typography variant="h6">
            All Gateways
          </Typography>
        </Grid>
        <Grid>
          <Button
            data-testid="add-gateway"
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}>
            Add New Gateway
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Devices</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gateways?.map((gateway) => (
              <TableRow key={gateway.serial_number} data-testid="row-gateway">
                <TableCell>{gateway.serial_number}</TableCell>
                <TableCell>{gateway.name}</TableCell>
                <TableCell>{gateway.ip_address}</TableCell>
                <TableCell
                  sx={{ color: gateway.devices.length < 10 ? 'green' : 'red' }}
                >
                  {gateway.devices.length}
                </TableCell>
                <TableCell>
                  <IconButton color="info" component={Link} to={`/gateways/${gateway.serial_number}`}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    data-testid="delete-gateway"
                    color="error"
                    onClick={() => handleRemoveGateway(gateway.serial_number)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <GatewayDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddGateway={handleAddGateway}
        isUniqueSerialNumber={isUniqueSerialNumber}
      />
    </>
  );
}

export default GatewayList
