<script>
  import {
    Card,
    Span,
    Textarea,
    Toolbar,
    ToolbarButton,
  } from 'flowbite-svelte';
  import { Clipboard } from 'svelte-heros-v2';

  import { inputState } from '../stores/input-store';

  const handlePasteClick = () => {
    navigator.clipboard.readText().then(value => {
      $inputState = value;
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
