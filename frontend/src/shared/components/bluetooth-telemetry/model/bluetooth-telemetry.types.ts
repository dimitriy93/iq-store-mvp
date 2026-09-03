import type {ComponentType} from "react";
import type {IIconProps} from "@/shared/components/icons";

export interface ITelemetryItemProps {
    icon: ComponentType<IIconProps>;
    label: string;
    value: string;
    active?: boolean;
    delay?: number;
}