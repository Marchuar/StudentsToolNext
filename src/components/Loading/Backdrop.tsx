import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import type {FC} from "react";

interface ILoadingProps {
    isOpen: boolean;
}

const LoadBackdrop: FC<ILoadingProps> = ({ isOpen }) =>  {
    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default LoadBackdrop;

