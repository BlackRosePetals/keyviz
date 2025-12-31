import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemGrid, ItemTitle } from "@/components/ui/item"

export const AboutPage = () => {

    const checkForUpdates = () => {
        
    }

    return <div className="flex flex-col gap-y-4">
        <div className="py-6 flex flex-col items-center bg-linear-to-b from-secondary to-background">
            <img src="./tauri.svg" alt="logo" className="w-24 h-24" />
            <h1 className="mt-4 mb-2 text-xl font-semibold">Keyviz</h1>
            <p className="text-sm text-muted-foreground">v2.0.4a</p>
            <p className="text-sm text-muted-foreground">© 2026 Rahul Mula</p>
        </div>

        <ItemGrid className="px-6">
            {/* Check for update */}
            <Item variant="muted">
                <ItemContent>
                    <ItemTitle>Check for update</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline" size="sm" onClick={checkForUpdates}>Check</Button>
                </ItemActions>
            </Item>

            {/* Donate/Report Issue */}

            {/* Links */}
        </ItemGrid>
    </div>
}