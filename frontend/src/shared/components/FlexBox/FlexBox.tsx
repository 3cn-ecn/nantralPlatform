// cspell:ignore Overridable
import { Box, Theme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { BoxTypeMap } from '@mui/system';

// eslint-disable-next-line @typescript-eslint/ban-types
type FlexBoxComponent = OverridableComponent<BoxTypeMap<{}, 'div', Theme>>;

export const FlexRow: FlexBoxComponent = (props) => {
  return <Box display="flex" flexDirection="row" {...props} />;
};

export const FlexCol: FlexBoxComponent = (props) => {
  return <Box display="flex" flexDirection="column" {...props} />;
};
