import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { DiscordIcon, FavouriteIcon, GithubIcon, Globe02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export const AboutPage = () => {
    return <div>
        <div className="py-6 flex flex-col items-center bg-linear-to-b from-secondary to-background">
            <img src="./tauri.svg" alt="logo" className="w-24 h-24" />
            <h1 className="mt-4 mb-2 text-xl font-semibold">Keyviz</h1>
            <p className="text-sm text-muted-foreground">v2.0.4a</p>
            <p className="text-sm text-muted-foreground">© 2026 Rahul Mula</p>
        </div>

        <div className="mt-6 px-6 flex flex-col gap-4">
            {/* Check for update */}
            {/* <Item variant="muted">
                <ItemContent>
                    <ItemTitle>Check for update</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" size="sm" onClick={() => {}}>Check</Button>
                </ItemActions>
            </Item> */}

            {/* Donate/Report Issue */}
            <Item variant="muted">
                <ItemContent>
                    <ItemTitle>Support</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" size="sm">
                        <HugeiconsIcon icon={FavouriteIcon} /> Github Sponsor
                    </Button>
                </ItemActions>
            </Item>

            <Item variant="muted" className="col-span-2">
                <ItemContent>
                    <ItemTitle>Links</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline">
                        <HugeiconsIcon icon={Globe02Icon} /> Website
                    </Button>
                    <Button variant="outline">
                        <HugeiconsIcon icon={GithubIcon} /> Github
                    </Button>
                    <Button variant="outline">
                        <HugeiconsIcon icon={DiscordIcon} /> Discord
                    </Button>
                </ItemActions>
            </Item>
        </div>
    </div>
}