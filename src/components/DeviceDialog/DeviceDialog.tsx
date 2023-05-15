import { useMemo, useState } from "react";
import { Device } from "../../@types";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, Box, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface DeviceDialogProps {
    open: boolean;
    onClose: () => void;
    onAddDevice: (gateway: Device) => void;
}

const defaultValues: Device = {
    uid: 0,
    vendor: '',
    date_created: new Date(),
    status: "online",
}

const DeviceDialog = (props: DeviceDialogProps) => {

    const { open, onClose, onAddDevice } = props
    const [formData, setFormData] = useState<Device>(defaultValues)
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof Device, string>>>({})

    const validationForm: Partial<Record<keyof Device, (value: string) => string | undefined>> = {
        vendor: value => !value ? 'Vendor is not valid' : undefined,
    }

    const handleChange = (name: keyof Device, value: string) => {
        console.log({ name }, { value });

        setFormData(oldFormData => ({ ...oldFormData, [name]: value }))
        if (validationForm[name]) {
            setFormErrors(oldFormErrors => ({
                ...oldFormErrors,
                [name]: validationForm[name]?.(value)
            }))
        }
    }

    const handleSubmit = () => {
        setFormData(defaultValues)
        onAddDevice({
            ...formData,
            uid: Math.floor(Math.random() * 1000),
            date_created: new Date()
        })
        onClose()
    };

    const handleClose = () => {
        setFormData(defaultValues)
        onClose()
    };

    const canSubmit = useMemo(() => {
        if (Object.values(formData).some(value => {
            return value === '';
        })) {
            return false
        }

        return !Object.values(formErrors).some(value => {
            return !!value;
        });
    }, [formData, formErrors])

    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle data-testid="chargeDialogTitle">Add D</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(formErrors?.vendor)}
                                helperText={formErrors?.vendor}
                                required
                                id="vendor"
                                name="vendor"
                                label="Vendor"
                                value={formData.vendor}
                                fullWidth
                                variant="standard"
                                onChange={(e) => handleChange(e.target.name as keyof Device, e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} marginTop={2}>
                            <FormControl>
                                <FormLabel id="status">Status</FormLabel>
                                <RadioGroup
                                    aria-labelledby="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={(e) => handleChange(e.target.name as keyof Device, e.target.value)}
                                    row
                                >
                                    <FormControlLabel value="online" control={<Radio />} label="Online" />
                                    <FormControlLabel value="offline" control={<Radio />} label="Offline" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={handleClose}>Cancel</Button>
                    <Button
                        data-testId="add-device"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        variant='contained'
                    >
                        Add Device
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default DeviceDialog