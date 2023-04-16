<script>
  import {
    Card,
    Span,
    Textarea,
    Toast,
    Toolbar,
    ToolbarButton,
  } from 'flowbite-svelte';
  import { fly } from 'svelte/transition';
  import { Document } from 'svelte-heros-v2';

  import { outputState } from '../stores/output-store';

  let copyToastOpen = false;

  const handleCopyClick = () => {
    navigator.clipboard.writeText($outputState).then(_ => {
      if (copyToastOpen) return;
      copyToastOpen = true;

      setTimeout(() => {
        copyToastOpen = false;
      }, 5000);
    });
  };
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
      <ToolbarButton slot="end" on:click={handleCopyClick}>
        <Document />
      </ToolbarButton>
    </Toolbar>
  </Textarea>
</Card>
<Toast params="{{y: 200}}" position="top-right" transition={fly} bind:open={copyToastOpen}>
  <svelte:fragment slot="icon">
    <Document />
  </svelte:fragment>
  Copied text to clipboard.
</Toast>
