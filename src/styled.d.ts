import 'styled-components';
import { ThemeType } from './styles/theme'; // Import the theme type you exported

// This tells styled-components that its DefaultTheme is the same as your ThemeType
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}