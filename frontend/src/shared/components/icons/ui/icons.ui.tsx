export interface IIconProps {
    className?: string;
}

export const CatalogIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect height="7" rx="1" width="7" x="3" y="3"/>
        <rect height="7" rx="1" width="7" x="14" y="3"/>
        <rect height="7" rx="1" width="7" x="14" y="14"/>
        <rect height="7" rx="1" width="7" x="3" y="14"/>
    </svg>
);

export const CartIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);

export const BluetoothIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 7L17 17L12 21V3L17 7L7 17"/>
    </svg>
);

export const GemIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3h12l4 6-10 13L2 9l4-6Z"/>
        <path d="M11 3 8 9l4 13 4-13-3-6"/>
        <path d="M2 9h20"/>
    </svg>
);

export const UserRoundIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 0 0-16 0"/>
    </svg>
);

export const PlusIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
    </svg>
);

export const MinusIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
        <path d="M5 12h14"/>
    </svg>
);

export const CheckIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

export const XIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
    </svg>
);

export const TrashIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 6h18"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
    </svg>
);

export const ArrowRightIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
    </svg>
);

export const ArrowLeftIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
        <path d="M19 12H5"/>
        <path d="m12 19-7-7 7-7"/>
    </svg>
);

export const TriangleAlertIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.73 18 13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
    </svg>
);

export const RadioIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
        <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
    </svg>
);

export const WavesIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    </svg>
);

export const BatteryMediumIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect height="12" rx="2" width="16" x="2" y="7"/>
        <line x1="22" x2="22" y1="11" y2="13"/>
        <rect fill="currentColor" height="6" rx="0.5" stroke="none" width="5" x="5" y="10"/>
    </svg>
);

export const BluetoothOffIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m7 7 10 10-5 4V13l5 4-10-10"/>
        <path d="m3 3 18 18"/>
    </svg>
);

export const BluetoothConnectedIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m7 7 10 10-5 4V3l5 4L7 17"/>
        <path d="M6 9h.01"/>
        <path d="M6 15h.01"/>
    </svg>
);

export const UnplugIcon = ({className}: IIconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m19 5 3-3"/>
        <path d="m2 22 3-3"/>
        <path d="M6.329 9.636a5 5 0 1 1 7.071-7.071l4.672 4.672a5 5 0 1 1-7.07 7.071z"/>
        <path d="m9 13-5.5 5.5"/>
        <path d="m13 9 5.5-5.5"/>
    </svg>
);