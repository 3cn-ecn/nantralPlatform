import { Typography, Button, useTheme } from "@mui/material";
import { SidebarBox } from "./SidebarBox";
import { PrimaryButton } from "#shared/components/Button/PrimaryButton";

export function OfflineFooter() {
    const theme = useTheme();

    return(
        <SidebarBox>
            <p
                className="mb-2 uppercase text-xs"
            >
                Already have an account?
            </p>
            <p
                className="mb-4"
            >
                Retrouve tes espaces, événements et associations depuis un seul endroit.
            </p>
            <PrimaryButton fullWidth={true}>
                Se connecter
            </PrimaryButton>
        </SidebarBox>
    );
}