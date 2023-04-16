<script>
    import { Card, Span, Textarea, Toolbar, ToolbarButton } from "flowbite-svelte";
    import { Clipboard } from "svelte-heros-v2";

    import { inputState } from "../stores/input-store";
</script>

<Card class="h-full" size="100%">
    <Textarea rows={17} style="resize: none" title="Input" bind:value={$inputState}>
        <Toolbar slot="header" embedded>
            <Span>Input</Span>
            <ToolbarButton slot="end">
                <Clipboard />
            </ToolbarButton>
        </Toolbar>
    </Textarea>
</Card>
