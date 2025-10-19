import { Container, ContainerProps } from '@mui/material';

export function FloatingContainer({ children, ...props }: ContainerProps) {
  return (
    <Container
      sx={{
        py: 3,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        minHeight: '100%',
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
