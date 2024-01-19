import { FunctionComponent, PropsWithChildren } from "react";

import './global.css';

export const AssetProvider: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <>{children}</>
)