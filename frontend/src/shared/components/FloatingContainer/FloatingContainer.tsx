import { Container, ContainerProps } from '@mui/material';

export function FloatingContainer({ children, ...props }: ContainerProps) {
  return (
    <Container
      sx={{
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
