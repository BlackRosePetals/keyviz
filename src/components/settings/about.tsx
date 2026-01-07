import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { DiscordIcon, GithubIcon, Globe02Icon, Link04Icon, SecurityIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { openUrl } from "@tauri-apps/plugin-opener"

export const AboutPage = () => {
    return <div>
        <div className="py-6 flex flex-col items-center bg-linear-to-b from-secondary to-background">
            <img src="./logo.svg" alt="logo" className="w-24 h-24" />
            <h1 className="mt-4 mb-2 text-xl font-semibold">Keyviz</h1>
            <p className="text-center text-sm text-muted-foreground">
                v2.1.0-beta <br />
                © 2026 Rahul Mula
            </p>
        </div>

        <div className="mt-6 px-6 flex flex-col gap-4">
            <Item variant="muted">
                <ItemMedia variant="icon">
                    <HugeiconsIcon icon={SecurityIcon} />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>Privacy First</ItemTitle>
                    <ItemDescription>
                        Keyviz works entirely offline. Your keystrokes are processed locally and are never transmitted to the internet.
                    </ItemDescription>
                </ItemContent>
            </Item>

            {/* Check for update */}
            {/* <Item variant="muted">
                <ItemContent>
                    <ItemTitle>Check for update</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" size="sm" onClick={() => {}}>Check</Button>
                </ItemActions>
            </Item> */}

            <Item variant="muted" className="col-span-2">
                <ItemMedia variant="icon">
                    <HugeiconsIcon icon={Link04Icon} />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>Links</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" onClick={() => openUrl('https://mularahul.github.io/keyviz/')}>
                        <HugeiconsIcon icon={Globe02Icon} /> Website
                    </Button>
                    <Button variant="outline" onClick={() => openUrl('https://github.com/mulaRahul/keyviz')}>
                        <HugeiconsIcon icon={GithubIcon} /> Github
                    </Button>
                    <Button variant="outline" onClick={() => openUrl('https://discord.gg/er9pddccyS')}>
                        <HugeiconsIcon icon={DiscordIcon} /> Discord
                    </Button>
                </ItemActions>
            </Item>
        </div>
    </div>
}