import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { DiscordIcon, FavouriteIcon, GithubIcon, LinkSquare02Icon, StarsIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { openUrl } from "@tauri-apps/plugin-opener"
import { useState } from "react"
import { toast } from "sonner"

export const VERSION = "2.1.0"

export const AboutPage = () => {
    const [checking, setChecking] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);

    const visitReleasePage = () => {
        openUrl('https://github.com/mulaRahul/keyviz/releases');
    }

    const checkForUpdates = async () => {
        setChecking(true);
        try {
            const response = await fetch('https://api.github.com/repos/mulaRahul/keyviz/releases/latest')
            const data = await response.json()
            const latestVersion = data.tag_name.substring(1, 6);
            if (latestVersion !== VERSION) {
                setUpdateAvailable(true);
                toast.success(
                    `New version available: v${latestVersion}`,
                    {
                        action: { label: 'View', onClick: visitReleasePage }
                    }
                );
            } else {
                toast.info("You are using the latest version.");
            }
        } catch (error) {
            toast.error("Failed to check for updates.");
        }
        setChecking(false);
    }

    return <div>
        <div className="py-6 flex flex-col items-center bg-linear-to-b from-secondary to-background">
            <img src="./logo.svg" alt="logo" className="w-24 h-24" />
            <h1 className="mt-4 mb-2 text-xl font-semibold">Keyviz</h1>
            <p className="text-center text-sm text-muted-foreground">
                v{VERSION}-beta <br />
                © 2026 Rahul Mula
            </p>
        </div>

        <div className="mt-6 px-6 flex flex-col gap-4">
            <Item variant="muted">
                <ItemContent>
                    <ItemTitle>
                        <HugeiconsIcon icon={StarsIcon} size="1em" /> Check for updates
                    </ItemTitle>
                    <ItemDescription className="max-w-100">
                        GitHub releases page to check for the latest version.
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    {
                        updateAvailable
                            ? <Button size="sm" className="cursor-pointer" onClick={visitReleasePage}>Update Available</Button>
                            : <Button variant="outline" size="sm" onClick={checkForUpdates} disabled={checking}>Check</Button>
                    }
                </ItemActions>
            </Item>

            <Item variant="muted">
                <ItemContent>
                    <ItemTitle>
                        <HugeiconsIcon icon={GithubIcon} size="1em" /> Open Source
                    </ItemTitle>
                    <ItemDescription className="max-w-100">
                        Review the source code on GitHub, start the project, or contribute to its development.
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" size="icon-sm" onClick={() => openUrl('https://github.com/mulaRahul/keyviz')}>
                        <HugeiconsIcon icon={LinkSquare02Icon} />
                    </Button>
                </ItemActions>
            </Item>

            <Item variant="muted">
                <ItemContent>
                    <ItemTitle>
                        <HugeiconsIcon icon={FavouriteIcon} size="1em" /> Sponsor
                    </ItemTitle>
                    <ItemDescription>
                        If you like Keyviz, consider supporting its development.
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" size="icon-sm" onClick={() => openUrl('https://github.com/sponsors/mulaRahul')}>
                        <HugeiconsIcon icon={FavouriteIcon} />
                    </Button>
                </ItemActions>
            </Item>

            <Item variant="muted">
                <ItemContent>
                    <ItemTitle>
                        <HugeiconsIcon icon={DiscordIcon} size="1em" /> Discord
                    </ItemTitle>
                    <ItemDescription className="max-w-100">
                        Join our Discord community.
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" size="icon-sm" onClick={() => openUrl('https://discord.gg/er9pddccyS')}>
                        <HugeiconsIcon icon={LinkSquare02Icon} />
                    </Button>
                </ItemActions>
            </Item>
        </div>
    </div>
}