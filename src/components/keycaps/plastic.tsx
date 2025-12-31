import { KeycapProps } from ".";

export const PlasticKeycap = ({ keyData, isPressed }: KeycapProps) => {
    return (
        <div>
            {keyData.name}
        </div>
    );
}