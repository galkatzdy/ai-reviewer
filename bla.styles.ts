import { Button } from '@material-ui/core';
import styled from 'styled-components';

export const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.palette.primary.main};
`;
