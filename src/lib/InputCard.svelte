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
  import { Clipboard } from 'svelte-heros-v2';

  import { inputState } from '../stores/input-store';

  let failedPasteToastOpen = false;

  const handlePasteClick = () => {
    navigator.clipboard
      .readText()
      .then((value) => {
        $inputState = value;
      })
      .catch((_) => {
        if (failedPasteToastOpen) return;
        failedPasteToastOpen = true;

        setTimeout(() => {
          failedPasteToastOpen = false;
        }, 5000);
      });
  };
</script>

<Card class="h-full" size="100%">
  <Textarea
    rows={13}
    style="resize: none"
    title="Input"
    bind:value={$inputState}
  >
    <Toolbar slot="header" embedded>
      <Span>Input</Span>
      <ToolbarButton slot="end" on:click={handlePasteClick}>
        <Clipboard />
      </ToolbarButton>
    </Toolbar>
  </Textarea>
</Card>
<Toast
  color="red"
  params={{ y: 200 }}
  position="top-right"
  transition={fly}
  bind:open={failedPasteToastOpen}
>
  <svelte:fragment slot="icon">
    <Clipboard />
  </svelte:fragment>
  Read permission denied.
</Toast>
