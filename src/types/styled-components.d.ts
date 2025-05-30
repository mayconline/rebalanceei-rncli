import type { Theme } from '../themes';

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}
