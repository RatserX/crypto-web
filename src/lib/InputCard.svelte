<script>
    import { Card, Span, Textarea, Toolbar, ToolbarButton } from "flowbite-svelte";
    import { Clipboard } from "svelte-heros-v2";
</script>

<Card size="100%">
    <Textarea rows={10} style="resize: none">
        <Toolbar slot="header" embedded>
            <Span>Input</Span>
            <ToolbarButton slot="end">
                <Clipboard />
            </ToolbarButton>
        </Toolbar>
    </Textarea>
</Card>