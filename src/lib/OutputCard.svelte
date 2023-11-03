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

  let successfulCopyToastOpen = false;

  const handleCopyClick = () => {
    navigator.clipboard.writeText($outputState).then((_) => {
      if (successfulCopyToastOpen) return;
      successfulCopyToastOpen = true;

      setTimeout(() => {
        successfulCopyToastOpen = false;
      }, 5000);
    });
  };
</script>

<Card size={null}>
  <Textarea
    disabled
    rows={7}
    style="resize: none"
    title="Output"
    value={$outputState}
  >
    <Toolbar class="p-0" color="dark" slot="header" embedded>
      <Span>Output</Span>
      <ToolbarButton slot="end" on:click={handleCopyClick}>
        <Document />
      </ToolbarButton>
    </Toolbar>
  </Textarea>
</Card>
<Toast
  color="green"
  params={{ y: 200 }}
  position="top-right"
  transition={fly}
  bind:open={successfulCopyToastOpen}
>
  <svelte:fragment slot="icon">
    <Document />
  </svelte:fragment>
  Copied text to clipboard.
</Toast>
