import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useToast } from '@/store/features/notification/toast';

export default function GlobalAlert() {
    const { open, message, type, hide  } = useToast();

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={hide}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={hide}
                severity={type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}