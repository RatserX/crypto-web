<script>
  import {
    Card,
    Span,
    Textarea,
    Toolbar,
    ToolbarButton,
  } from 'flowbite-svelte';
  import { Document } from 'svelte-heros-v2';

  import { outputState } from '../stores/output-store';
</script>

<Card size="100%">
  <Textarea
    disabled
    rows={7}
    style="resize: none"
    title="Output"
    value={$outputState}
  >
    <Toolbar slot="header" embedded>
      <Span>Output</Span>
      <ToolbarButton slot="end">
        <Document />
      </ToolbarButton>
    </Toolbar>
  </Textarea>
</Card>
