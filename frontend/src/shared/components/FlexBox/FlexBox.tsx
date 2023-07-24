// cspell:ignore Overridable
import { ComponentProps } from 'react';

import { Box, Breakpoint, Theme, useMediaQuery, useTheme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { BoxTypeMap } from '@mui/system';

type FlexBoxComponent<Extra = object> = OverridableComponent<
  BoxTypeMap<Extra, 'div', Theme>
>;

export const FlexRow: FlexBoxComponent = (
  props: ComponentProps<FlexBoxComponent>
) => {
  return <Box display="flex" flexDirection="row" {...props} />;
};

export const FlexCol: FlexBoxComponent = (
  props: ComponentProps<FlexBoxComponent>
) => {
  return <Box display="flex" flexDirection="column" {...props} />;
};

export const FlexAuto: FlexBoxComponent<{ breakPoint?: Breakpoint }> = ({
  breakPoint = 'md',
  alignItems,
  justifyContent,
  ...props
}: ComponentProps<FlexBoxComponent<{ breakPoint?: Breakpoint }>>) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up(breakPoint));

  return (
    <Box
      display="flex"
      flexDirection={isLargeScreen ? 'row' : 'column'}
      alignItems={isLargeScreen ? alignItems : justifyContent}
      justifyContent={isLargeScreen ? justifyContent : alignItems}
      {...props}
    />
  );
};
