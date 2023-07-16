import { PropsWithChildren, createContext, useContext, useState } from 'react';

import { Alert, AlertColor, Snackbar } from '@mui/material';

type Toast = {
  message: string;
  variant?: AlertColor;
  autoHideDuration?: number;
};

type ToastContextActions = { showToast: (toast: Toast) => void };

const ToastContext = createContext<ToastContextActions | null>(null);

const ToastProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast | undefined>();

  const showToast = (toast: Toast) => {
    setToast(toast);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Snackbar
        open={open}
        autoHideDuration={toast?.autoHideDuration ?? 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ top: { xs: 72, sm: 80 } }}
      >
        <Alert
          onClose={handleClose}
          severity={toast?.variant}
          elevation={6}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextActions => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useSnackBar must be used within an SnackBarProvider');
  }

  return context;
};

export { ToastProvider, useToast };
