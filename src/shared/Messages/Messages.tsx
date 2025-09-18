import Alert from '@mui/material/Alert';

export const successMessage = () => {
    return <Alert severity="success" onClose={() => {}}>This is a success Alert.</Alert>
};

export const errorMessage = () => {
    return <Alert severity="error">This is an error Alert.</Alert>
};