// Import components
import StyledButton from "./StyledButton"
import { Add } from "@mui/icons-material";

const CreateItemButton = ({ onClick  }: {
    onClick: () => void,
}): JSX.Element => {
    return (
        <StyledButton
        content={<Add />}
        onClick={onClick}
        />
    );
}

export default CreateItemButton;