import { useMemo, useState } from "react";
import { Gateway } from "../../@types";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, Box, DialogActions } from "@mui/material";
import { ipv4AddressRegex, serialNumberRegex } from "../../utils/regexValidation";

interface GatewayDialogProps {
    open: boolean;
    onClose: () => void;
    onAddGateway: (gateway: Gateway) => void;
    isUniqueSerialNumber: (serial_number: string) => boolean
}

const defaultValues = {
    serial_number: '',
    name: '',
    ip_address: '',
    devices: [],
}

const GatewayDialog = (props: GatewayDialogProps) => {

    const { open, onClose, onAddGateway, isUniqueSerialNumber } = props
    const [formData, setFormData] = useState<Gateway>(defaultValues)
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof Gateway, string>>>({})

    const validationForm: Partial<Record<keyof Gateway, (value: string) => string | undefined>> = {
        serial_number: value => {
            if (!serialNumberRegex.test(value)) return 'Serial Number is not valid'
            if (!isUniqueSerialNumber(value)) return 'Serial Number is already used before'
            return undefined
        },
        name: value => !value ? 'Name is not valid' : undefined,
        ip_address: value => ipv4AddressRegex.test(value) ? undefined : 'IP address is not valid',
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as { name: keyof Gateway, value: string }
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
        onAddGateway(formData)
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
                <DialogTitle>Add Gateway</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(formErrors?.serial_number)}
                                helperText={formErrors?.serial_number}
                                required
                                id="serial_number"
                                name="serial_number"
                                label="Serial Number"
                                value={formData.serial_number}
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(formErrors?.name)}
                                helperText={formErrors?.name}
                                required
                                id="name"
                                name="name"
                                label="Name"
                                value={formData.name}
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={Boolean(formErrors?.ip_address)}
                                helperText={formErrors?.ip_address}
                                required
                                id="ip_address"
                                name="ip_address"
                                label="IP Address"
                                value={formData.ip_address}
                                fullWidth
                                variant="standard"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={handleClose}>Cancel</Button>
                    <Button
                        data-testId="save-gateway"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        variant='contained'
                    >
                        Add Gateway
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default GatewayDialog