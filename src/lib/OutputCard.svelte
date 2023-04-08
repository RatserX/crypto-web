<script>
    import { Card, Span, Textarea, Toolbar, ToolbarButton } from "flowbite-svelte";
    import { Document } from "svelte-heros-v2";
</script>

<Card size="100%">
    <Textarea rows={10} style="resize: none">
        <Toolbar slot="header" embedded>
            <Span>Output</Span>
            <ToolbarButton slot="end">
                <Document />
            </ToolbarButton>
        </Toolbar>
    </Textarea>
</Card>