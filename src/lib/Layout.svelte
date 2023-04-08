<script>
    import InputCard from "./InputCard.svelte";
    import OptionsCard from "./OptionsCard.svelte";
    import OutputCard from "./OutputCard.svelte";

</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
        <InputCard />
    </div>
    <div>
        <OptionsCard />
    </div>
    <div class="md:col-span-2">
        <OutputCard />
    </div>
</div>
